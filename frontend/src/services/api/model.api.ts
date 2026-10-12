import { http } from '@services/http'
import type { ModelPayload, ModelResponse, ModelsResponse } from '@/types'

// Models are the companions members chat with. Admin only.
export const modelApi = {
  list: () => http.get<ModelsResponse>('/api/operator/models'),
  create: (model: ModelPayload) => http.post<ModelResponse>('/api/operator/models', model),
  update: (id: string, model: ModelPayload) => http.put<ModelResponse>(`/api/operator/models/${id}`, model),
  remove: (id: string) => http.delete<{ success: true }>(`/api/operator/models/${id}`),
}
