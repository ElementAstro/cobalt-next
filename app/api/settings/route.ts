import { NextResponse } from 'next/server';
import defaultSettings from '../../../sampleSettings.json';
import { SettingsData, SettingValue } from '../../../types/settings';

let settings: SettingsData = JSON.parse(JSON.stringify(defaultSettings));

export async function GET() {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return NextResponse.json(settings);
}

export async function POST(request: Request) {
  const { path, value } = await request.json();
  
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 500));

  // Update the settings
  let current: any = settings;
  for (let i = 0; i < path.length - 1; i++) {
    if (current.settings) {
      current = current.settings.find((s: any) => s.id === path[i]);
    } else {
      current = current.find((s: any) => s.id === path[i]);
    }
    if (!current) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }
  }
  
  const lastKey = path[path.length - 1];
  if (current.settings) {
    const setting = current.settings.find((s: any) => s.id === lastKey);
    if (setting) {
      setting.value = value;
    } else {
      return NextResponse.json({ error: 'Setting not found' }, { status: 400 });
    }
  } else {
    const setting = current.find((s: any) => s.id === lastKey);
    if (setting) {
      setting.value = value;
    } else {
      return NextResponse.json({ error: 'Setting not found' }, { status: 400 });
    }
  }

  return NextResponse.json(settings);
}

export async function PUT() {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 500));
  
  settings = JSON.parse(JSON.stringify(defaultSettings));
  return NextResponse.json(settings);
}

