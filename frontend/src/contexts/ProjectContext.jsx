import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from './useAuth';
import { ProjectContext } from './ProjectContextValue';
import {
  createProject as createProjectRequest,
  deleteProject as deleteProjectRequest,
  listProjects,
  updateProject as updateProjectRequest,
} from '../services/projectsApi';

function readProjectList(result) {
  const projects = Array.isArray(result) ? result : result?.projects;
  if (!Array.isArray(projects)) {
    throw new Error('The projects response must be an array.');
  }
  return projects;
}

export function ProjectProvider({ children }) {
  const { token } = useAuth();
  const [state, setState] = useState({
    token: null,
    projects: [],
    loading: false,
    error: '',
  });
  const projects = useMemo(
    () => state.token === token ? state.projects : [],
    [state.projects, state.token, token]
  );
  const loading = Boolean(token) && (state.token !== token || state.loading);
  const error = state.token === token ? state.error : '';

  const refreshProjects = useCallback(async () => {
    if (!token) return;

    setState((current) => ({
      token,
      projects: current.token === token ? current.projects : [],
      loading: true,
      error: '',
    }));
    try {
      const result = readProjectList(await listProjects());
      setState({ token, projects: result, loading: false, error: '' });
    } catch (requestError) {
      setState({ token, projects: [], loading: false, error: requestError.message });
      throw requestError;
    }
  }, [token]);

  useEffect(() => {
    if (!token) return undefined;

    let active = true;
    listProjects()
      .then((result) => {
        if (active) setState({ token, projects: readProjectList(result), loading: false, error: '' });
      })
      .catch((requestError) => {
        if (active) setState({ token, projects: [], loading: false, error: requestError.message });
      });

    return () => {
      active = false;
    };
  }, [token]);

  const createProject = useCallback(async (data) => {
    const project = await createProjectRequest(data);
    if (!project || project.id === undefined) {
      throw new Error('The create project response did not include a project id.');
    }
    setState((current) => current.token === token
      ? { ...current, projects: [project, ...current.projects] }
      : current);
    return project;
  }, [token]);

  const updateProject = useCallback(async (projectId, data) => {
    const project = await updateProjectRequest(projectId, data);
    if (!project || project.id === undefined) {
      throw new Error('The update project response did not include a project id.');
    }
    setState((current) => current.token === token
      ? { ...current, projects: current.projects.map((item) => item.id === project.id ? project : item) }
      : current);
    return project;
  }, [token]);

  const deleteProject = useCallback(async (projectId) => {
    await deleteProjectRequest(projectId);
    setState((current) => current.token === token
      ? { ...current, projects: current.projects.filter((project) => project.id !== projectId) }
      : current);
  }, [token]);

  const value = useMemo(
    () => ({
      projects,
      loading,
      error,
      refreshProjects,
      createProject,
      updateProject,
      deleteProject,
    }),
    [projects, loading, error, refreshProjects, createProject, updateProject, deleteProject]
  );

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}
