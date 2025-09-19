import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  FileText,
  MessageSquare,
  Star,
  Heart,
  CreditCard,
  Activity,
  FolderOpen,
  Tags
} from 'lucide-react';

const menuItems = [
  { title: "Dashboard", key: "dashboard", icon: LayoutDashboard },
  { title: "Acessos", key: "acessos", icon: Activity },
  { title: "Categorias", key: "categorias", icon: FolderOpen },
  { title: "Subcategorias", key: "subcategorias", icon: Tags },
  { title: "Clientes", key: "clientes", icon: Users },
  { title: "Profissionais", key: "profissionais", icon: UserCheck },
  { title: "Solicitações", key: "solicitacoes", icon: FileText },
  { title: "Propostas", key: "propostas", icon: MessageSquare },
  { title: "Avaliações", key: "avaliacoes", icon: Star },
  { title: "Planos", key: "planos", icon: CreditCard },
];

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function AdminSidebar({ activeSection, onSectionChange }: AdminSidebarProps) {
  const { state } = useSidebar();

  return (
    <Sidebar className={state === "collapsed" ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-white border-r border-gray-200">
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-bold mb-4 text-gray-800">
            {state !== "collapsed" && "Admin Panel"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    onClick={() => onSectionChange(item.key)}
                    className={`w-full justify-start px-3 py-2 rounded-lg transition-colors ${
                      activeSection === item.key 
                        ? "bg-primary text-white" 
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {state !== "collapsed" && <span className="ml-2">{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}