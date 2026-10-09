import { useContext } from 'react';
import { ProjectContext } from './ProjectContextValue';

export function useProjects() {
  const context = useContext(ProjectContext);
  if (!context) throw new Error('useProjects must be used within a ProjectProvider.');
  return context;
}
