import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { projectService } from '../services/projectService';
import { storageService } from '../services/storageService';
import Header from '../components/Layout/Header';
import Modal from '../components/Common/Modal';
import { FaPlus, FaTrash, FaEdit, FaFolder } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { createDefaultProjectFiles } from '../utils/helpers';

export default function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newProject, setNewProject] = useState({
        name: '',
        description: '',
        framework: 'react'
    });

    useEffect(() => {
        loadProjects();
    }, [user]);

    const loadProjects = async () => {
        setLoading(true);
        try {
            if (user) {
                // Load from backend for authenticated users
                const response = await projectService.getProjects();
                setProjects(response || []);
            } else {
                // Load from localStorage for non-authenticated users
                const localProjects = storageService.getAllProjects();
                setProjects(localProjects);
            }
        } catch (error) {
            console.error('Failed to load projects:', error);
            toast.error('Failed to load projects');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProject = async () => {
        if (!newProject.name.trim()) {
            toast.error('Please enter a project name');
            return;
        }

        try {
            if (user) {
                // For authenticated users - backend handles file creation
                const project = await projectService.createProject(newProject);
                navigate(`/ide/${project.projectSlug}`);
            } else {
                // For non-authenticated users - create files locally
                const projectSlug = `${newProject.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
                const projectId = `local_${Date.now()}`;

                const project = {
                    ...newProject,
                    projectSlug,
                    _id: projectId,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };

                // CREATE DEFAULT FILES WITH PROPER STRUCTURE
                const defaultFiles = createDefaultProjectFiles(projectId, newProject.name);

                // Save project with files to localStorage
                storageService.saveProject(projectSlug, {
                    project,
                    files: defaultFiles,
                    timestamp: Date.now()
                });

                navigate(`/ide/${projectSlug}`);
            }

            setShowCreateModal(false);
            setNewProject({ name: '', description: '', framework: 'react' });
            toast.success('Project created successfully!');
        } catch (error) {
            toast.error('Failed to create project');
            console.error(error);
        }
    };

    const handleDeleteProject = async (projectId, projectSlug) => {
        if (!confirm('Are you sure you want to delete this project?')) return;

        try {
            if (user) {
                await projectService.deleteProject(projectId);
            } else {
                storageService.deleteProject(projectSlug);
            }
            await loadProjects();
            toast.success('Project deleted successfully');
        } catch (error) {
            toast.error('Failed to delete project');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        My Projects
                    </h1>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 "
                    >
                        <FaPlus />
                        New Project
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : projects.length === 0 ? (
                    <div className="text-center py-16">
                        <FaFolder className="text-6xl text-gray-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-700 mb-2">No projects yet</h2>
                        <p className="text-gray-500 mb-6">Create your first project to get started</p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-primary-600 text-black px-6 py-3 rounded-lg hover:bg-primary-700 transition"
                        >
                            Create Project
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <div
                                key={project._id}
                                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer"
                            >
                                <div onClick={() => navigate(`/ide/${project.projectSlug}`)}>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        {project.name}
                                    </h3>
                                    <p className="text-gray-600 mb-4 line-clamp-2">
                                        {project.description || 'No description'}
                                    </p>
                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded">
                                            {project.framework || 'react'}
                                        </span>
                                        <span>
                                            {new Date(project.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-4 pt-4 border-t">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/ide/${project.projectSlug}`);
                                        }}
                                        className="flex-1 flex items-center justify-center gap-2 bg-primary-600 text-white px-3 py-2 rounded hover:bg-primary-700 transition"
                                    >
                                        <FaEdit /> Open
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteProject(project._id, project.projectSlug);
                                        }}
                                        className="flex items-center justify-center gap-2 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Project Modal */}
            {showCreateModal && (
                <Modal onClose={() => setShowCreateModal(false)}>
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-4">Create New Project</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Project Name *
                                </label>
                                <input
                                    type="text"
                                    value={newProject.name}
                                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="My Awesome Project"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={newProject.description}
                                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    rows="3"
                                    placeholder="What is this project about?"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Framework
                                </label>
                                <select
                                    value={newProject.framework}
                                    onChange={(e) => setNewProject({ ...newProject, framework: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                >
                                    <option value="react">React</option>
                                    <option value="vue">Vue</option>
                                    <option value="vanilla">Vanilla JS</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateProject}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Create Project
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}