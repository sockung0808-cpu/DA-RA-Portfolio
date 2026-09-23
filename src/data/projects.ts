import type { Project } from '../types'
import { images } from './images'

export type ProjectCaseStudy = Project & {
  image: string
  slug: string
  role: string
  problem: string
  solution: string
  result: string
  features: string[]
  demo_url?: string | null
  github_url?: string | null
}

export const projects: ProjectCaseStudy[] = [
  {
    number: '01',
    slug: 'workflow-it-manager',
    title: 'WorkFlow IT Manager',
    category: 'MANAGEMENT SYSTEM',
    description:
      'Nền tảng quản lý vận hành IT, tập trung vào công việc, nhân sự, hỗ trợ và dữ liệu nội bộ.',
    tech: ['React', 'TypeScript', 'Supabase'],
    icon: '◈',
    role: 'Solution design · Frontend · Database',
    problem:
      'Công việc hỗ trợ và dữ liệu vận hành dễ bị phân tán giữa nhiều file, tin nhắn và thao tác thủ công.',
    solution:
      'Thiết kế một web app tập trung để quản lý dữ liệu, công việc và quy trình theo hướng dễ mở rộng.',
    result:
      'Tạo nền tảng để tiếp tục mở rộng thành hệ thống quản lý vận hành IT thống nhất.',
    features: ['Dashboard', 'Task Management', 'Employee Management', 'Supabase Database'],
    image: images.projects.workflow,
  },
  {
    number: '02',
    slug: 'it-operations-dashboard',
    title: 'IT Operations Dashboard',
    category: 'IT OPERATIONS',
    description:
      'Dashboard theo dõi hoạt động IT và hỗ trợ quan sát tình trạng vận hành theo hướng trực quan.',
    tech: ['Web App', 'Dashboard', 'Automation'],
    icon: '◌',
    role: 'Product concept · UI · Development',
    problem:
      'Thông tin vận hành cần được nhìn thấy nhanh thay vì phải kiểm tra thủ công từ nhiều nguồn.',
    solution:
      'Thiết kế dashboard tập trung các chỉ số và khu vực thông tin quan trọng thành một giao diện dễ quét.',
    result:
      'Giảm độ phức tạp khi quan sát và tạo nền tảng cho các workflow tiếp theo.',
    features: ['Dashboard', 'Operational Views', 'Quick Actions', 'Automation-ready'],
    image: images.projects.operations,
  },
  {
    number: '03',
    slug: 'printer-management',
    title: 'Printer Management',
    category: 'IT MANAGEMENT',
    description:
      'Ứng dụng quản lý máy in, thiết bị, lịch sử thay mực và các hoạt động bảo trì.',
    tech: ['React', 'Supabase', 'Vercel'],
    icon: '▣',
    role: 'Full-stack · Data model · Deployment',
    problem:
      'Thông tin máy in và lịch sử mực/bảo trì cần được theo dõi tập trung để tránh thất lạc dữ liệu.',
    solution:
      'Xây dựng ứng dụng quản lý thiết bị, lịch sử thay mực và dữ liệu vận hành trên nền web.',
    result:
      'Có hệ thống trực tuyến để truy cập nhanh dữ liệu máy in và lịch sử bảo trì.',
    features: ['Printer Records', 'Ink History', 'Maintenance', 'Online Deployment'],
    image: images.projects.printer,
  },
  {
    number: '04',
    slug: 'wms-pro',
    title: 'WMS Pro - Quản lý kho hàng & tài sản',
    category: 'WAREHOUSE / ASSET',
    description:
      'Giải pháp quản lý kho hàng và tài sản theo hướng trực quan, hỗ trợ theo dõi và kiểm soát dữ liệu.',
    tech: ['Web App', 'Inventory', 'Asset'],
    icon: '▤',
    role: 'System concept · UI · Workflow',
    problem:
      'Quản lý kho và tài sản cần có cách nhìn trực quan hơn để giảm phụ thuộc vào bảng tính rời rạc.',
    solution:
      'Thiết kế workflow và dashboard quản lý dữ liệu kho/tài sản theo hướng tập trung.',
    result:
      'Tạo một giao diện dễ quan sát để tiếp tục xây dựng quy trình quản lý chi tiết.',
    features: ['Inventory', 'Asset Tracking', 'Dashboard', 'Workflow'],
    image: images.projects.wms,
  },
]

export const projectCategories = ['ALL', 'MANAGEMENT', 'IT OPERATIONS', 'AUTOMATION', 'WAREHOUSE'] as const
