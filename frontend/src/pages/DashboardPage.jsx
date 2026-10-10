import { useMemo, useState } from 'react';
import {
  AlertCircle,
  FolderOpen,
  LoaderCircle,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import SchemaBackground from '../components/common/SchemaBackground';
import Button from '../components/common/Button';
import CardContainer from '../components/common/CardContainer';
import StatusBadge from '../components/common/StatusBadge';
import { useProjects } from '../contexts/useProjects';

const EMPTY_FORM = { name: '', description: '' };

export default function DashboardPage() {
  const {
    projects,
    loading,
    error,
    refreshProjects,
    createProject,
    updateProject,
    deleteProject,
  } = useProjects();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [actionError, setActionError] = useState('');

  const statuses = useMemo(
    () => ['All', ...new Set(projects.map((project) => project.status).filter(Boolean))],
    [projects]
  );
  const filteredProjects = projects.filter((project) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = `${project.name || ''} ${project.description || ''}`.toLowerCase().includes(query);
    return matchesSearch && (statusFilter === 'All' || project.status === statusFilter);
  });

  const openCreateForm = () => {
    setEditingProject(null);
    setForm(EMPTY_FORM);
    setActionError('');
    setShowProjectForm(true);
  };

  const openEditForm = (project) => {
    setEditingProject(project);
    setForm({ name: project.name || '', description: project.description || '' });
    setActionError('');
    setShowProjectForm(true);
  };

  const closeForm = () => {
    if (isSaving) return;
    setShowProjectForm(false);
    setEditingProject(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setActionError('');
    setIsSaving(true);
    try {
      if (editingProject) {
        await updateProject(editingProject.id, {
          ...form,
          status: editingProject.status || 'DRAFT',
        });
      } else {
        await createProject(form);
      }
      setShowProjectForm(false);
      setEditingProject(null);
    } catch (requestError) {
      setActionError(requestError.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (project) => {
    if (!window.confirm(`Delete "${project.name}"? This action cannot be undone.`)) return;
    setActionError('');
    try {
      await deleteProject(project.id);
    } catch (requestError) {
      setActionError(requestError.message);
    }
  };

  const handleRefresh = async () => {
    setActionError('');
    try {
      await refreshProjects();
    } catch (requestError) {
      setActionError(requestError.message);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 pb-24 overflow-hidden">
      <SchemaBackground variant="default" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-800/80">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Your private workspace</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white">
              Migration <span className="italic font-normal text-amber-400">Workspace</span>
            </h1>
            <p className="text-slate-400 mt-2 text-base">
              Manage your migration projects and continue schema analysis.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="md"
              icon={RefreshCw}
              onClick={handleRefresh}
              disabled={loading}
            >
              Refresh
            </Button>
            <Button variant="amber" size="md" icon={Plus} onClick={openCreateForm} disabled={loading}>
              New Project
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 my-8">
          <CardContainer className="p-5 bg-slate-900/80">
            <span className="text-xs font-mono uppercase text-slate-400 block mb-1">Your Projects</span>
            <span className="text-3xl font-extrabold text-white font-mono">{projects.length}</span>
            <p className="text-xs text-slate-500 mt-2">Saved to your account</p>
          </CardContainer>
          <CardContainer className="p-5 bg-slate-900/80">
            <span className="text-xs font-mono uppercase text-slate-400 block mb-1">Drafts</span>
            <span className="text-3xl font-extrabold text-amber-400 font-mono">
              {projects.filter((project) => project.status === 'DRAFT').length}
            </span>
            <p className="text-xs text-amber-400/80 mt-2">Ready to analyze</p>
          </CardContainer>
          <CardContainer className="p-5 bg-slate-900/80">
            <span className="text-xs font-mono uppercase text-slate-400 block mb-1">Engine Pair</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-indigo-300 font-mono">MySQL → PostgreSQL</span>
            <p className="text-xs text-indigo-300/80 mt-2">Schema migration</p>
          </CardContainer>
          <CardContainer className="p-5 bg-slate-900/80">
            <span className="text-xs font-mono uppercase text-slate-400 block mb-1">Scope Boundary</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">Schema-only</span>
            <p className="text-xs text-emerald-400/80 mt-2">No row data touched</p>
          </CardContainer>
        </div>

        {showProjectForm && (
          <CardContainer className="p-6 mb-6 bg-slate-900/90 border-indigo-500/30">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <h2 className="font-display text-xl font-bold text-white">
                  {editingProject ? 'Edit project' : 'Create a project'}
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  {editingProject ? 'Update project details and preserve its current status.' : 'Projects are saved to your account.'}
                </p>
              </div>
              <button type="button" onClick={closeForm} disabled={isSaving} aria-label="Close project form">
                <X className="w-5 h-5 text-slate-400 hover:text-white" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
              <label className="text-xs font-mono uppercase text-slate-400">
                Project name
                <input
                  required
                  maxLength={120}
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  className="mt-2 w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  placeholder="My Migration"
                />
              </label>
              <label className="text-xs font-mono uppercase text-slate-400">
                Description
                <textarea
                  value={form.description}
                  onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                  className="mt-2 w-full min-h-11 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 resize-y"
                  placeholder="MySQL to PostgreSQL migration"
                />
              </label>
              {actionError && (
                <p role="alert" className="md:col-span-2 flex items-start gap-2 text-sm text-rose-300">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{actionError}</span>
                </p>
              )}
              <div className="md:col-span-2 flex justify-end gap-3">
                <Button variant="secondary" onClick={closeForm} disabled={isSaving}>Cancel</Button>
                <Button type="submit" variant="primary" disabled={isSaving} icon={isSaving ? LoaderCircle : Plus}>
                  {isSaving ? 'Saving...' : editingProject ? 'Save Changes' : 'Create Project'}
                </Button>
              </div>
            </form>
          </CardContainer>
        )}

        {actionError && !showProjectForm && (
          <p role="alert" className="mb-5 flex items-start gap-2 text-sm text-rose-300">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{actionError}</span>
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 mb-6 backdrop-blur-md">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search your projects..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {statuses.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  statusFilter === status
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-950/70 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {status === 'All' ? status : status.replaceAll('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div role="status" className="flex items-center justify-center gap-3 py-20 text-slate-400">
            <LoaderCircle className="w-5 h-5 animate-spin text-indigo-400" />
            Loading your projects...
          </div>
        ) : error ? (
          <CardContainer className="p-10 text-center max-w-2xl mx-auto my-12 bg-slate-900/70">
            <AlertCircle className="w-8 h-8 text-rose-400 mx-auto mb-4" />
            <h2 className="font-display text-xl font-bold text-white mb-2">Projects could not be loaded</h2>
            <p role="alert" className="text-sm text-rose-300 mb-6">{error}</p>
            <Button variant="secondary" icon={RefreshCw} onClick={handleRefresh}>
              Try Again
            </Button>
          </CardContainer>
        ) : filteredProjects.length === 0 ? (
          <CardContainer className="p-16 text-center max-w-2xl mx-auto my-12 bg-slate-900/50 border-dashed border-slate-700">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-6 text-indigo-400">
              <FolderOpen className="w-8 h-8" />
            </div>
            <h2 className="font-display text-2xl font-bold text-white mb-2">
              {projects.length ? 'No projects match your search' : 'No projects yet'}
            </h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-8 leading-relaxed">
              {projects.length
                ? 'Try another project name or status filter.'
                : 'Create your first project to keep its migration work organized.'}
            </p>
            {projects.length
              ? <Button variant="secondary" onClick={() => { setSearchQuery(''); setStatusFilter('All'); }}>Reset Filters</Button>
              : <Button variant="amber" icon={Plus} onClick={openCreateForm}>Create First Project</Button>}
          </CardContainer>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <CardContainer key={project.id} className="p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <StatusBadge status={project.status || 'DRAFT'} size="sm" />
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEditForm(project)}
                        aria-label={`Edit ${project.name}`}
                        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(project)}
                        aria-label={`Delete ${project.name}`}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-300 hover:bg-slate-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <h2 className="font-display text-xl font-bold text-white mb-2 break-words">{project.name}</h2>
                  <p className="text-sm text-slate-400 min-h-10 whitespace-pre-wrap break-words">
                    {project.description || 'No description provided.'}
                  </p>
                </div>
                <div className="pt-4 mt-5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-mono">Project #{project.id}</span>
                  <span className="font-mono text-indigo-400">{String(project.status || 'DRAFT').replaceAll('_', ' ')}</span>
                </div>
              </CardContainer>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
