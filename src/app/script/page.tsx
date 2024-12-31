'use client';

import { useScriptStore } from '../../store/useScriptStore';
import { useEffect, useState } from 'react';
import ScriptList from '../../components/script/ScriptList';
import JsonNode from '../../components/script/json-node';

export default function ScriptPage() {
  const { scripts, selectedScript, selectScript, updateScript, deleteScript } = useScriptStore();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (selectedScript) {
      setIsEditing(true);
    }
  }, [selectedScript]);

  return (
    <div className="flex h-full flex-col md:flex-row gap-4 p-4">
      {/* Toolbar */}
      <div className="flex gap-2 p-2 border-b">
        <button className="p-2 hover:bg-gray-100 rounded">Save</button>
        <button className="p-2 hover:bg-gray-100 rounded">Undo</button>
        <button className="p-2 hover:bg-gray-100 rounded">Redo</button>
        <select className="p-2 bg-transparent">
          <option>Light</option>
          <option>Dark</option>
        </select>
        <select className="p-2 bg-transparent">
          <option>Default Font</option>
          <option>Large Font</option>
        </select>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col md:flex-row gap-4">
        {/* Script List */}
        <div className="w-full md:w-1/4">
          <ScriptList 
            scripts={scripts}
            onSelectScript={selectScript}
          />
        </div>

        {/* Editor Area */}
        <div className="flex-1">
          {isEditing && selectedScript ? (
            <div className="h-full flex flex-col">
              <div className="flex-1 overflow-auto">
                <JsonNode
                  data={selectedScript}
                  path={[]}
                  onchange={(path: string[], value: any) => {
                    if (selectedScript) {
                      const updatedScript = { ...selectedScript, ...value };
                      updateScript(selectedScript.id, updatedScript);
                    }
                  }}
                  ondelete={(path: string[]) => {
                    if (selectedScript && confirm('Are you sure you want to delete this script?')) {
                      deleteScript(selectedScript.id);
                      selectScript('');
                    }
                  }}
                  onAddChild={(path: string[]) => {
                    if (selectedScript) {
                      const newScript = { 
                        ...selectedScript,
                        [path.join('.')]: '' // Add empty string as new child
                      };
                      updateScript(selectedScript.id, newScript);
                    }
                  }}
                />
              </div>
              <div className="p-2 border-t text-sm text-gray-500">
                Line: 1 | Column: 1
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Select a script to edit</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
