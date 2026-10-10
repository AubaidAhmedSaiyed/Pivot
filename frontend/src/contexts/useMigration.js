import { useContext } from 'react';
import { MigrationContext } from './MigrationContextValue';

export function useMigration() {
  const context = useContext(MigrationContext);
  if (!context) throw new Error('useMigration must be used within a MigrationProvider.');
  return context;
}
