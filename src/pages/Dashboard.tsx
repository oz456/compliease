
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import DocumentsCard from '@/components/dashboard/DocumentsCard';
import { FileText, ClipboardList, AlertTriangle } from 'lucide-react';
import { Document } from '@/hooks/useDocuments';
import { Link } from 'react-router-dom';

// Sample documents data with all required properties for Document type
const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'PAN Card.pdf',
    type: 'PDF',
    category: 'Identity Document',
    uploadedAt: 'Apr 10, 2025',
    fileSize: '1.2 MB',
    url: '/documents/1',
    size: 1200000,
    uploadedBy: 'John Doe',
    userId: 'user-1'
  },
  {
    id: '2',
    name: 'GST Registration.pdf',
    type: 'PDF',
    category: 'Tax Document',
    uploadedAt: 'Apr 15, 2025',
    fileSize: '850 KB',
    url: '/documents/2',
    size: 850000,
    uploadedBy: 'Jane Smith',
    userId: 'user-2'
  },
  {
    id: '3',
    name: 'Business Plan.docx',
    type: 'DOCX',
    category: 'Business Plan',
    uploadedAt: 'Apr 20, 2025',
    fileSize: '2.5 MB',
    url: '/documents/3',
    size: 2500000,
    uploadedBy: 'John Doe',
    userId: 'user-1'
  },
];

// Mock company information
const mockCompanyInfo = {
  id: "comp-123",
  name: "Acme Corporation",
  registrationStatus: "in-progress",
  industry: "Technology",
  registrationDate: "Jun 15, 2025"
};

// Mock compliances data
const mockCompliances = [
  {
    id: "comp-1",
    title: "Submit GST Registration",
    description: "Complete GST registration process",
    dueDate: "Apr 30, 2025",
    category: "Taxation",
    priority: "high",
    status: "pending",
  },
  {
    id: "comp-2",
    title: "File Annual Returns",
    description: "Complete annual return filing",
    dueDate: "May 15, 2025",
    category: "Compliance",
    priority: "medium",
    status: "in-progress",
  },
  {
    id: "comp-3",
    title: "Renew Business License",
    description: "Renew the business operation license",
    dueDate: "Jun 10, 2025",
    category: "Licensing",
    priority: "low",
    status: "completed",
  }
];

const Dashboard = () => {
  const compliances = mockCompliances;
  const companyInfo = mockCompanyInfo;
  
  const upcomingCompliances = compliances.filter(compliance => 
    compliance.status === 'pending' || compliance.status === 'in-progress'
  ).slice(0, 3);
  
  const pendingCompliancesCount = compliances.filter(compliance => compliance.status === 'pending').length;
  const inProgressCompliancesCount = compliances.filter(compliance => compliance.status === 'in-progress').length;
  const overdueCompliancesCount = compliances.filter(compliance => compliance.status === 'overdue' || false).length;
  
  // Calculate compliance health metrics
  const calculateComplianceHealth = () => {
    if (!compliances.length) return { 
      score: 100, 
      completedCompliances: 0, 
      totalCompliances: 0, 
      nextSteps: [] 
    };
    
    const totalCompliances = compliances.length;
    const completedCompliances = compliances.filter(compliance => compliance.status === 'completed').length;
    
    // Basic score calculation: completed compliances percentage
    const score = Math.round((completedCompliances / totalCompliances) * 100);
    
    // Generate next steps based on compliance status
    const nextSteps = [];
    
    if (overdueCompliancesCount > 0) {
      nextSteps.push("Address overdue compliance requirements immediately");
    }
    
    if (pendingCompliancesCount > 0) {
      nextSteps.push("Complete pending regulatory requirements");
    }
    
    if (score < 70) {
      nextSteps.push("Schedule a compliance review session");
    }
    
    return {
      score,
      completedCompliances,
      totalCompliances,
      nextSteps
    };
  };

  const healthMetrics = calculateComplianceHealth();
  const { score, completedCompliances, totalCompliances, nextSteps } = healthMetrics;

  return (
    <MainLayout>
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's an overview of your company compliance status.
          </p>
        </header>
        
        <>
          {companyInfo && (
            <div className="mb-6">
              <CompanyStatusCard companyInfo={companyInfo} />
            </div>
          )}
          
          <div className="grid gap-6 md:grid-cols-3">
            <StatsCard
              title="Pending Compliances"
              value={`${pendingCompliancesCount}`}
              icon={<ClipboardList className="h-5 w-5" />}
              description={`${inProgressCompliancesCount} compliances in progress`}
            />
            
            <StatsCard
              title="Documents Uploaded"
              value="2/8"
              icon={<FileText className="h-5 w-5" />}
              description="6 more documents required"
            />
            
            <StatsCard
              title="Overdue Compliances"
              value={`${overdueCompliancesCount}`}
              icon={<AlertTriangle className="h-5 w-5" />}
              description={overdueCompliancesCount > 0 ? "Requires immediate attention" : "Everything is on track"}
            />
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <ComplianceHealth
              score={score}
              completedCompliances={completedCompliances}
              totalCompliances={totalCompliances}
              nextSteps={nextSteps}
            />
            
            <div className="lg:col-span-2">
              <TasksList compliances={upcomingCompliances} />
            </div>
          </div>
          
          <div>
            <DocumentsCard recentDocuments={mockDocuments} />
          </div>
        </>
      </div>
    </MainLayout>
  );
};

// Define the needed types
interface CompanyInfo {
  id: string;
  name: string;
  registrationStatus: string;
  industry: string;
  registrationDate?: string;
}

// CompanyStatusCard component
const CompanyStatusCard: React.FC<{ companyInfo: CompanyInfo }> = ({ companyInfo }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <div className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded px-2 py-1 text-xs font-medium">Completed</div>;
      case 'in-progress':
        return <div className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded px-2 py-1 text-xs font-medium">In Progress</div>;
      case 'not-started':
        return <div className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded px-2 py-1 text-xs font-medium">Not Started</div>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow-sm border">
      <div className="pb-2">
        <h3 className="text-lg font-medium">Company Information</h3>
      </div>
      <div>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 text-muted-foreground opacity-70">🏢</div>
            <div>
              <h3 className="text-xl font-semibold">{companyInfo.name}</h3>
              <p className="text-sm text-muted-foreground">{companyInfo.industry}</p>
            </div>
          </div>

          <div className="pt-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Registration Status</span>
              {getStatusBadge(companyInfo.registrationStatus)}
            </div>
            
            {companyInfo.registrationDate && (
              <Link to="/compliances" className="flex items-center gap-2 hover:text-primary text-muted-foreground">
                <span>📅</span>
                <span>Registration Date: {companyInfo.registrationDate}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// TasksList component
const TasksList: React.FC<{ compliances: any[] }> = ({ compliances }) => {
  return (
    <div className="bg-card rounded-lg shadow-sm border">
      <div className="flex flex-row items-center justify-between p-6 pb-4">
        <h3 className="text-lg font-medium">Upcoming Compliances</h3>
        <Link to="/compliances" className="text-sm text-primary hover:underline">
          View all
        </Link>
      </div>
      <div className="px-0">
        <div className="space-y-4">
          {compliances.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <div className="mx-auto h-10 w-10 opacity-25 mb-3">📝</div>
              <p>No upcoming tasks</p>
            </div>
          ) : (
            compliances.map((compliance) => (
              <div key={compliance.id} className="flex items-center justify-between px-6 py-3 hover:bg-muted/50 transition-colors">
                <div className="flex flex-col gap-1">
                  <div className="font-medium">{compliance.title}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Due: {compliance.dueDate}</span>
                    <TaskStatusBadge status={compliance.status} />
                  </div>
                </div>
                <button className="text-muted-foreground hover:text-foreground">
                  &gt;
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// TaskStatusBadge component
const TaskStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  let badgeClass = '';
  let label = '';
  
  switch(status) {
    case 'pending':
      badgeClass = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      label = 'Pending';
      break;
    case 'in-progress':
      badgeClass = 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      label = 'In Progress';
      break;
    case 'completed':
      badgeClass = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      label = 'Completed';
      break;
    case 'overdue':
      badgeClass = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      label = 'Overdue';
      break;
    default:
      badgeClass = 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      label = status;
  }
  
  return (
    <span className={`${badgeClass} rounded px-2 py-0.5 text-xs font-medium`}>
      {label}
    </span>
  );
};

// ComplianceHealth component
const ComplianceHealth: React.FC<{
  score: number;
  completedCompliances: number;
  totalCompliances: number;
  nextSteps?: string[];
}> = ({ score, completedCompliances, totalCompliances, nextSteps = [] }) => {
  // Helper function to determine score color
  const getScoreColor = (value: number) => {
    if (value >= 80) return 'text-green-600 dark:text-green-400';
    if (value >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="bg-card rounded-lg shadow-sm border">
      <div className="p-6">
        <h3 className="text-lg font-medium">Compliance Health</h3>
      </div>
      <div className="px-6 pb-6">
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Overall Score</div>
              <div className={`text-3xl font-bold ${getScoreColor(score)}`}>{score}%</div>
            </div>
            <div className="h-20 w-20 relative flex items-center justify-center">
              <svg viewBox="0 0 36 36" className="h-20 w-20 -rotate-90">
                <path
                  className="stroke-muted"
                  fill="none"
                  strokeWidth="3"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={`${score >= 80 ? 'stroke-green-500' : score >= 60 ? 'stroke-yellow-500' : 'stroke-red-500'}`}
                  fill="none"
                  strokeWidth="3"
                  strokeDasharray={`${score}, 100`}
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Compliances Completed</span>
              <span className="text-sm font-medium">{completedCompliances}/{totalCompliances}</span>
            </div>
            <div className="h-2 w-full bg-muted overflow-hidden rounded-full">
              <div 
                className="h-full bg-primary" 
                style={{ width: `${(completedCompliances / totalCompliances) * 100}%` }}
              ></div>
            </div>
          </div>

          {nextSteps.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <span>Recommended Actions</span>
              </h4>
              <ul className="text-sm space-y-1.5">
                {nextSteps.map((step, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="rounded-full bg-primary/10 text-primary px-1.5 text-xs mt-0.5">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
