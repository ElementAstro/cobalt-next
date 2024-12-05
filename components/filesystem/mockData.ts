import { Folder, File, FileType } from './types'

export const mockFileSystem: Folder = {
  id: 'root',
  name: 'Root',
  files: [
    {
      id: '1',
      name: '视频',
      type: 'folder',
      files: [
        { id: '1-1', name: 'video1.mp4', type: 'video', size: 1024000, lastModified: new Date('2023-12-01') },
        { id: '1-2', name: 'video2.mp4', type: 'video', size: 2048000, lastModified: new Date('2023-12-02') },
      ]
    },
    {
      id: '2',
      name: '图片',
      type: 'folder',
      files: [
        { id: '2-1', name: 'image1.jpg', type: 'image', size: 512000, lastModified: new Date('2023-12-03') },
        { id: '2-2', name: 'image2.png', type: 'image', size: 768000, lastModified: new Date('2023-12-04') },
      ]
    },
    {
      id: '3',
      name: '文档',
      type: 'folder',
      files: [
        { id: '3-1', name: 'document1.pdf', type: 'document', size: 256000, lastModified: new Date('2023-12-05'), content: 'This is a sample PDF content.' },
        { id: '3-2', name: 'document2.docx', type: 'document', size: 384000, lastModified: new Date('2023-12-06'), content: 'This is a sample Word document content.' },
      ]
    }
  ]
}

