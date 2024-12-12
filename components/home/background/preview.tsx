interface PreviewProps {
  style: React.CSSProperties
}

export function Preview({ style }: PreviewProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">预览</h3>
      <div style={style} className="w-full h-64 rounded-md"></div>
    </div>
  )
}

