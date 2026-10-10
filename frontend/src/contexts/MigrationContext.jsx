import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from './useAuth';
import { MigrationContext } from './MigrationContextValue';
import {
  analyzeSchema,
  diffSchema,
  generateMigrationSql,
  predictComplexity,
  reviewMigration,
} from '../services/migrationApi';

export function MigrationProvider({ children }) {
  const { token } = useAuth();
  const requestVersion = useRef(0);
  const [state, setState] = useState({
    token: null,
    migration: null,
    loading: false,
    step: 0,
    error: '',
  });
  const migration = state.token === token ? state.migration : null;
  const loading = state.token === token && state.loading;
  const step = state.token === token ? state.step : 0;
  const error = state.token === token ? state.error : '';

  useEffect(() => {
    requestVersion.current += 1;
  }, [token]);

  const runMigration = useCallback(async (sourceSql) => {
    if (!sourceSql.trim()) {
      const validationError = new Error('Enter or upload a MySQL schema before starting analysis.');
      setState({
        token,
        migration: null,
        loading: false,
        step: 0,
        error: validationError.message,
      });
      throw validationError;
    }

    const requestVersionAtStart = ++requestVersion.current;
    setState({
      token,
      migration: null,
      loading: true,
      step: 1,
      error: '',
    });

    try {
      const [analysis, prediction] = await Promise.all([
        analyzeSchema({ sql: sourceSql }),
        predictComplexity({ sql: sourceSql }),
      ]);
      if (requestVersionAtStart !== requestVersion.current) return null;
      if (!analysis?.summary || !Array.isArray(analysis.tables)) {
        throw new Error('The schema analysis response did not include summary and table data.');
      }
      if (!prediction?.complexity) {
        throw new Error('The complexity response did not include a prediction.');
      }

      setState((current) => current.token === token ? { ...current, step: 2 } : current);
      const generated = await generateMigrationSql({ sql: sourceSql });
      if (requestVersionAtStart !== requestVersion.current) return null;
      const migrationResult = generated?.migration;
      if (!migrationResult?.sql) {
        throw new Error('The SQL generation response did not include generated SQL.');
      }

      setState((current) => current.token === token ? { ...current, step: 3 } : current);
      const [review, diff] = await Promise.all([
        reviewMigration({ sql: sourceSql }),
        diffSchema({ source_sql: sourceSql, target_sql: migrationResult.sql }),
      ]);
      if (requestVersionAtStart !== requestVersion.current) return null;
      if (!review?.review || !diff?.summary || !Array.isArray(diff.changes)) {
        throw new Error('The review or schema diff response did not match the expected API contract.');
      }

      const result = {
        sourceSql,
        analysis,
        prediction,
        migration: migrationResult,
        review: review?.review,
        diff,
      };
      setState((current) => current.token === token
        ? { ...current, migration: result, step: 4 }
        : current);
      return result;
    } catch (requestError) {
      if (requestVersionAtStart !== requestVersion.current) return null;
      setState((current) => current.token === token
        ? { ...current, loading: false, step: 0, error: requestError.message }
        : current);
      throw requestError;
    } finally {
      if (requestVersionAtStart === requestVersion.current) {
        setState((current) => current.token === token ? { ...current, loading: false } : current);
      }
    }
  }, [token]);

  const clearMigration = useCallback(() => {
    requestVersion.current += 1;
    setState({ token, migration: null, loading: false, error: '', step: 0 });
  }, [token]);

  const value = useMemo(
    () => ({ migration, loading, step, error, runMigration, clearMigration }),
    [migration, loading, step, error, runMigration, clearMigration]
  );

  return <MigrationContext.Provider value={value}>{children}</MigrationContext.Provider>;
}
