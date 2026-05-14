import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobsApi, categoriesApi } from '../utils/api';

export const useJobs = (params = {}) => {
  return useQuery({
    queryKey: ['jobs', params],
    queryFn: () => jobsApi.getAll(params).then(res => res.data)
  });
};

export const useJob = (slug) => {
  return useQuery({
    queryKey: ['job', slug],
    queryFn: () => jobsApi.getBySlug(slug).then(res => res.data),
    enabled: !!slug
  });
};

export const useJobById = (id) => {
  return useQuery({
    queryKey: ['job', 'admin', id],
    queryFn: () => jobsApi.getById(id).then(res => res.data),
    enabled: !!id
  });
};

export const useFeaturedJobs = () => {
  return useQuery({
    queryKey: ['jobs', 'featured'],
    queryFn: () => jobsApi.getFeatured().then(res => res.data)
  });
};

export const useLatestJobs = () => {
  return useQuery({
    queryKey: ['jobs', 'latest'],
    queryFn: () => jobsApi.getLatest().then(res => res.data)
  });
};

export const useSearchJobs = (params) => {
  return useQuery({
    queryKey: ['jobs', 'search', params],
    queryFn: () => jobsApi.search(params).then(res => res.data),
    enabled: Object.keys(params).some(key => params[key])
  });
};

export const useJobsByLocation = (city, params = {}) => {
  return useQuery({
    queryKey: ['jobs', 'location', city, params],
    queryFn: () => jobsApi.getByLocation(city, params).then(res => res.data),
    enabled: !!city
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll().then(res => res.data),
    staleTime: 5 * 60 * 1000
  });
};

export const useCategory = (slug) => {
  return useQuery({
    queryKey: ['category', slug],
    queryFn: () => categoriesApi.getBySlug(slug).then(res => res.data),
    enabled: !!slug
  });
};

export const useJobStats = () => {
  return useQuery({
    queryKey: ['jobs', 'stats'],
    queryFn: () => jobsApi.getStats().then(res => res.data)
  });
};

export const useAdminJobs = (params = {}) => {
  return useQuery({
    queryKey: ['admin', 'jobs', params],
    queryFn: () => jobsApi.getAllAdmin(params).then(res => res.data)
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => jobsApi.create(data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'jobs'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  });
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => jobsApi.update(id, data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'jobs'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  });
};

export const useToggleJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => jobsApi.toggle(id).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'jobs'] });
    }
  });
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => jobsApi.delete(id).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'jobs'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => categoriesApi.create(data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => categoriesApi.delete(id).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  });
};
