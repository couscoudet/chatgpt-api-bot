import React, { useState } from 'react';
import { useStore } from '../store';
import { Settings as SettingsIcon, Save, Check, AlertCircle, Trash2 } from 'lucide-react';
import OpenAI from 'openai';
import type { OpenAIModel } from '../types';

export const Settings: React.FC = () => {
  const { settings, updateSettings, clearSettings } = useStore();
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [models, setModels] = useState<OpenAIModel[]>([]);
  const [validated, setValidated] = useState(false);

  const validateApiKey = async (apiKey: string) => {
    setValidating(true);
    setError(null);
    setValidated(false);

    try {
      const openai = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true,
      });

      const response = await openai.models.list();
      
      const supportedModels: OpenAIModel[] = response.data
        .filter(model => model.id.startsWith('gpt'))
        .map(model => ({
          id: model.id,
          name: model.id,
          description: 'OpenAI Language Model',
          context_length: model.id.includes('32k') ? 32768 : 8192,
          supports_files: model.id === 'gpt-4-vision-preview'
        }));

      setModels(supportedModels);
      setValidated(true);
      return true;
    } catch (err) {
      setError('Invalid API key or connection error');
      return false;
    } finally {
      setValidating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const apiKey = formData.get('openaiKey') as string;
    
    if (apiKey !== settings.openaiKey) {
      const isValid = await validateApiKey(apiKey);
      if (!isValid) return;
    }

    updateSettings({
      openaiKey: apiKey,
      model: formData.get('model') as string,
      historyLength: Number(formData.get('historyLength')),
      googleDriveEnabled: formData.get('googleDrive') === 'on',
      googleCalendarEnabled: formData.get('googleCalendar') === 'on',
      googleMailEnabled: formData.get('googleMail') === 'on',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center">
          <SettingsIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Settings
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="p-4 bg-white rounded-lg shadow">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  OpenAI API Key
                  <div className="mt-1 relative">
                    <input
                      type="password"
                      name="openaiKey"
                      defaultValue={settings.openaiKey}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                      onBlur={(e) => validateApiKey(e.target.value)}
                    />
                    {validating && (
                      <div className="absolute right-2 top-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                      </div>
                    )}
                    {validated && !validating && (
                      <div className="absolute right-2 top-2 text-green-500">
                        <Check className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                </label>

                {error && (
                  <div className="flex items-center gap-2 text-red-500 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}

                {models.length > 0 && (
                  <label className="block text-sm font-medium text-gray-700">
                    Model
                    <select
                      name="model"
                      defaultValue={settings.model}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    >
                      {models.map((model) => (
                        <option key={model.id} value={model.id}>
                          {model.name} ({model.context_length.toLocaleString()} tokens
                          {model.supports_files ? ', supports files' : ''})
                        </option>
                      ))}
                    </select>
                  </label>
                )}
              </div>
            </div>

            <div className="mt-4 p-4 bg-white rounded-lg shadow">
              <label className="block text-sm font-medium text-gray-700">
                History Length
                <input
                  type="number"
                  name="historyLength"
                  defaultValue={settings.historyLength}
                  min="1"
                  max="100"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
            </div>

            <div className="mt-4 p-4 bg-white rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">
                Integrations
              </h3>
              <div className="mt-4 space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="googleDrive"
                    defaultChecked={settings.googleDriveEnabled}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-900">
                    Enable Google Drive
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="googleCalendar"
                    defaultChecked={settings.googleCalendarEnabled}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-900">
                    Enable Google Calendar
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="googleMail"
                    defaultChecked={settings.googleMailEnabled}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-900">
                    Enable Google Mail
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={validating}
              className="flex-1 flex justify-center items-center gap-2 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              Save Settings
            </button>
            <button
              type="button"
              onClick={clearSettings}
              className="flex items-center gap-2 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Trash2 className="w-5 h-5" />
              Clear Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};