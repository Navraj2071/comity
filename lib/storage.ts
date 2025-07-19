// Simple localStorage-based storage system for the compliance management tool

export interface User {
  id: string
  name: string
  email: string
  role: "Admin" | "Head of Department" | "SPOC" | "User" | "Reviewer"
  department: string
  status: "Active" | "Inactive"
  createdAt: string
}

export interface Department {
  id: string
  name: string
  head: string
  spoc: string
  userCount: number
  activeCheckpoints: number
  createdAt: string
}

export interface RegulatoryDepartment {
  id: string
  name: "RBI" | "NPCI" | "UIDAI" | "CSITE" | "IDRBT"
  fullName: string
  criticality: "Critical" | "High" | "Medium" | "Low"
  spoc: string
  description: string
  createdAt: string
  createdBy: string
}

export interface SubCheckpoint {
  id: string
  title: string
  department: string
  assignedTo: string
  deadline: string
  status: "pending" | "compliant" | "non-compliant" | "overdue"
  submittedBy?: string
  submittedDate?: string
  remarks?: string
  attachments?: string[]
  expectedClosureDate?: string
  hodReviewDate?: string
  hodRemarks?: string
  finalReviewDate?: string
  finalRemarks?: string
  reviewStage?: "hod" | "reviewer" | "completed"
  // For recurring checkpoints
  period?: string // e.g., "2024-Q1", "2024-05", "2024-H1", "2024"

  // New configuration fields
  isRemarksRequired?: boolean
  remarksType?: "text" | "number" | "percentage"
  remarksPlaceholder?: string
  isAttachmentRequired?: boolean
  responseTemplate?: {
    fileName: string
    fileSize: number
    fileType: string
    uploadedAt: string
    fileContent?: string // Base64 encoded template file
  }
}

export type CheckpointType = "ad-hoc" | "recurring"
export type RecurringFrequency = "monthly" | "quarterly" | "half-yearly" | "annually"

export interface Checkpoint {
  id: string
  letterNumber: string
  date: string
  regulatory: "RBI" | "NPCI" | "UIDAI" | "CSITE" | "IDRBT"
  title: string
  details: string
  subCheckpoints: SubCheckpoint[]
  createdAt: string
  createdBy: string
  // New fields for checkpoint categorization
  type: CheckpointType
  frequency?: RecurringFrequency
  // For ad-hoc checkpoints
  financialYear?: string
}

export interface Submission {
  id: string
  checkpointId: string
  subCheckpointId: string
  submittedBy: string
  submittedDate: string
  status: "pending_hod_review" | "pending_final_review" | "approved" | "rejected"
  complianceStatus: "compliant" | "non-compliant"
  remarks: string
  attachments: string[]
  expectedClosureDate?: string
  hodReviewDate?: string
  hodRemarks?: string
  finalReviewDate?: string
  finalRemarks?: string
  // For recurring checkpoints
  period?: string // e.g., "2024-Q1", "2024-05", "2024-H1", "2024"
}

// New interfaces for Policy/SOP management
export type DocumentType = "policy" | "sop"
export type DocumentStatus = "draft" | "under_review" | "approved" | "rejected" | "archived"

export interface DocumentVersion {
  id: string
  versionNumber: string
  fileName: string
  fileSize: number
  fileType: string
  uploadedBy: string
  uploadedAt: string
  changes: string
  fileContent?: string // Base64 encoded file content for demo
}

export interface PolicySOP {
  id: string
  title: string
  description: string
  type: DocumentType
  category: string
  department: string
  status: DocumentStatus
  currentVersion: string
  versions: DocumentVersion[]
  createdBy: string
  createdAt: string
  reviewerId?: string
  approverId?: string
  approvedAt?: string
  nextReviewDate: string
  reviewFrequency: "annually" | "bi-annually" | "quarterly"
  tags: string[]
  isActive: boolean
}

// RBI Audit interfaces
export type ObservationSeverity = "Critical" | "High" | "Medium" | "Low"
export type ObservationStatus = "Open" | "In Progress" | "Pending Closure" | "Closed" | "Overdue"

export type RBIObservation = {
  id: string
  observationNumber: string
  auditDate: string
  auditType: string
  auditCategory?: "RMP" | "IRAR" | "SSI" | "MNCR" // Add this field
  category: string
  severity: ObservationSeverity
  title: string
  description: string
  recommendation: string
  assignedDepartment: string
  assignedTo: string
  targetDate: string
  status: ObservationStatus
  progress: number
  createdBy: string
  createdAt: string
  lastUpdated: string
  actionTaken?: string
  departmentComments?: string
  evidenceUploaded?: string[]
  closureDate?: string
  reviewComments?: string
  reviewedBy?: string
  reviewedDate?: string
}

// Storage keys
const STORAGE_KEYS = {
  USERS: "comity_users",
  DEPARTMENTS: "comity_departments",
  REGULATORY_DEPARTMENTS: "comity_regulatory_departments",
  CHECKPOINTS: "comity_checkpoints",
  SUBMISSIONS: "comity_submissions",
  POLICIES_SOPS: "comity_policies_sops",
  RBI_OBSERVATIONS: "comity_rbi_observations",
  CURRENT_USER: "comity_current_user",
  INITIALIZED: "comity_initialized",
}

// Sample data
const SAMPLE_USERS: User[] = [
  {
    id: "1",
    name: "Admin",
    email: "admin@trik.com",
    role: "Admin",
    department: "IT",
    status: "Active",
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    name: "Priya Sharma",
    email: "priya.sharma@trik.com",
    role: "Head of Department",
    department: "Operations",
    status: "Active",
    createdAt: "2024-01-01",
  },
  {
    id: "3",
    name: "Amit Patel",
    email: "amit.patel@trik.com",
    role: "SPOC",
    department: "Operations",
    status: "Active",
    createdAt: "2024-01-01",
  },
  {
    id: "4",
    name: "Sneha Gupta",
    email: "sneha.gupta@trik.com",
    role: "User",
    department: "Legal",
    status: "Active",
    createdAt: "2024-01-01",
  },
  {
    id: "5",
    name: "Vikram Singh",
    email: "vikram.singh@trik.com",
    role: "SPOC",
    department: "HR",
    status: "Active",
    createdAt: "2024-01-01",
  },
  {
    id: "6",
    name: "Ananya Reddy",
    email: "ananya.reddy@trik.com",
    role: "User",
    department: "IT",
    status: "Active",
    createdAt: "2024-01-01",
  },
  {
    id: "7",
    name: "Arjun Mehta",
    email: "arjun.mehta@trik.com",
    role: "User",
    department: "Finance",
    status: "Active",
    createdAt: "2024-01-01",
  },
  {
    id: "8",
    name: "Kavya Nair",
    email: "kavya.nair@trik.com",
    role: "User",
    department: "HR",
    status: "Active",
    createdAt: "2024-01-01",
  },
  {
    id: "9",
    name: "Rohit Agarwal",
    email: "rohit.agarwal@trik.com",
    role: "Reviewer",
    department: "Legal",
    status: "Active",
    createdAt: "2024-01-01",
  },
  {
    id: "10",
    name: "Deepika Joshi",
    email: "deepika.joshi@trik.com",
    role: "User",
    department: "IT",
    status: "Active",
    createdAt: "2024-01-01",
  },
  {
    id: "11",
    name: "Rajesh Kumar",
    email: "rajesh.kumar@trik.com",
    role: "SPOC",
    department: "Compliance",
    status: "Active",
    createdAt: "2024-01-01",
  },
  {
    id: "12",
    name: "Meera Patel",
    email: "meera.patel@trik.com",
    role: "SPOC",
    department: "Compliance",
    status: "Active",
    createdAt: "2024-01-01",
  },
]

const SAMPLE_DEPARTMENTS: Department[] = [
  {
    id: "1",
    name: "Information Technology",
    head: "Admin",
    spoc: "Ananya Reddy",
    userCount: 4,
    activeCheckpoints: 8,
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    name: "Operations",
    head: "Priya Sharma",
    spoc: "Amit Patel",
    userCount: 3,
    activeCheckpoints: 6,
    createdAt: "2024-01-01",
  },
  {
    id: "3",
    name: "Legal & Compliance",
    head: "Rohit Agarwal",
    spoc: "Sneha Gupta",
    userCount: 2,
    activeCheckpoints: 4,
    createdAt: "2024-01-01",
  },
  {
    id: "4",
    name: "Human Resources",
    head: "Vikram Singh",
    spoc: "Kavya Nair",
    userCount: 2,
    activeCheckpoints: 3,
    createdAt: "2024-01-01",
  },
  {
    id: "5",
    name: "Finance",
    head: "Arjun Mehta",
    spoc: "Arjun Mehta",
    userCount: 1,
    activeCheckpoints: 2,
    createdAt: "2024-01-01",
  },
  {
    id: "6",
    name: "Compliance",
    head: "Rajesh Kumar",
    spoc: "Meera Patel",
    userCount: 2,
    activeCheckpoints: 5,
    createdAt: "2024-01-01",
  },
]

const SAMPLE_REGULATORY_DEPARTMENTS: RegulatoryDepartment[] = [
  {
    id: "1",
    name: "RBI",
    fullName: "Reserve Bank of India",
    criticality: "Critical",
    spoc: "Rohit Agarwal",
    description: "Central banking and monetary policy regulations",
    createdAt: "2024-01-01",
    createdBy: "1",
  },
  {
    id: "2",
    name: "NPCI",
    fullName: "National Payments Corporation of India",
    criticality: "Critical",
    spoc: "Amit Patel",
    description: "Payment systems and digital transaction regulations",
    createdAt: "2024-01-01",
    createdBy: "1",
  },
  {
    id: "3",
    name: "UIDAI",
    fullName: "Unique Identification Authority of India",
    criticality: "High",
    spoc: "Sneha Gupta",
    description: "Aadhaar and identity verification compliance",
    createdAt: "2024-01-01",
    createdBy: "1",
  },
  {
    id: "4",
    name: "CSITE",
    fullName: "Centre for Development of Advanced Computing",
    criticality: "Medium",
    spoc: "Ananya Reddy",
    description: "Cybersecurity and IT infrastructure standards",
    createdAt: "2024-01-01",
    createdBy: "1",
  },
  {
    id: "5",
    name: "IDRBT",
    fullName: "Institute for Development and Research in Banking Technology",
    criticality: "Medium",
    spoc: "Vikram Singh",
    description: "Banking technology and innovation standards",
    createdAt: "2024-01-01",
    createdBy: "1",
  },
]

const SAMPLE_CHECKPOINTS: Checkpoint[] = [
  {
    id: "1",
    letterNumber: "RBI/2024/001",
    date: "2024-01-15",
    regulatory: "RBI",
    title: "KYC Documentation Update",
    details: "Update KYC documentation as per new RBI guidelines for enhanced customer verification",
    createdAt: "2024-01-15",
    createdBy: "1",
    type: "ad-hoc",
    financialYear: "2023-2024",
    subCheckpoints: [
      {
        id: "1",
        title: "Review current KYC process",
        department: "Operations",
        assignedTo: "Amit Patel",
        deadline: "2024-02-15",
        status: "compliant",
        submittedBy: "Amit Patel",
        submittedDate: "2024-02-14",
        remarks: "KYC process reviewed and updated according to new guidelines",
        attachments: ["kyc_process_review.pdf"],
      },
      {
        id: "2",
        title: "Update documentation templates",
        department: "Legal",
        assignedTo: "Sneha Gupta",
        deadline: "2024-02-20",
        status: "compliant",
        submittedBy: "Sneha Gupta",
        submittedDate: "2024-02-18",
        remarks: "All documentation templates updated and approved",
        attachments: ["kyc_templates_v2.pdf"],
      },
      {
        id: "3",
        title: "Train staff on new procedures",
        department: "HR",
        assignedTo: "Vikram Singh",
        deadline: "2024-02-25",
        status: "compliant",
        submittedBy: "Vikram Singh",
        submittedDate: "2024-02-22",
        remarks: "Training completed for all relevant staff members",
        attachments: ["training_completion_report.pdf"],
      },
    ],
  },
  {
    id: "2",
    letterNumber: "NPCI/2024/002",
    date: "2024-01-20",
    regulatory: "NPCI",
    title: "Comprehensive Security Framework Implementation",
    details: "Implement enhanced security measures for payment processing systems across all departments",
    createdAt: "2024-01-20",
    createdBy: "1",
    type: "ad-hoc",
    financialYear: "2023-2024",
    subCheckpoints: [
      {
        id: "4",
        title: "Conduct comprehensive security assessment",
        department: "IT",
        assignedTo: "Ananya Reddy",
        deadline: "2024-02-10",
        status: "overdue",
        remarks: "",
        attachments: [],
      },
      {
        id: "5",
        title: "Implement network security controls",
        department: "IT",
        assignedTo: "Deepika Joshi",
        deadline: "2024-02-25",
        status: "compliant",
        submittedBy: "Deepika Joshi",
        submittedDate: "2024-02-24",
        remarks: "Network security controls implemented successfully",
        attachments: ["network_security_controls.pdf"],
      },
      {
        id: "6",
        title: "Security training program for IT staff",
        department: "HR",
        assignedTo: "Kavya Nair",
        deadline: "2024-03-01",
        status: "pending",
        remarks: "",
        attachments: [],
      },
      {
        id: "7",
        title: "Update incident response procedures",
        department: "Operations",
        assignedTo: "Amit Patel",
        deadline: "2024-03-05",
        status: "pending",
        remarks: "",
        attachments: [],
      },
      {
        id: "8",
        title: "Implement access control policies",
        department: "IT",
        assignedTo: "Admin",
        deadline: "2024-03-10",
        status: "pending",
        remarks: "",
        attachments: [],
      },
      {
        id: "9",
        title: "Security audit documentation",
        department: "Compliance",
        assignedTo: "Rajesh Kumar",
        deadline: "2024-03-15",
        status: "pending",
        remarks: "",
        attachments: [],
      },
    ],
  },
]

// Sample Policies and SOPs
const SAMPLE_POLICIES_SOPS: PolicySOP[] = [
  {
    id: "1",
    title: "Information Security Policy",
    description:
      "Comprehensive information security policy covering data protection, access controls, and incident response",
    type: "policy",
    category: "Security",
    department: "IT",
    status: "approved",
    currentVersion: "2.1",
    versions: [
      {
        id: "v1",
        versionNumber: "1.0",
        fileName: "InfoSec_Policy_v1.0.pdf",
        fileSize: 2048576,
        fileType: "application/pdf",
        uploadedBy: "1",
        uploadedAt: "2023-01-15",
        changes: "Initial version",
      },
      {
        id: "v2",
        versionNumber: "2.0",
        fileName: "InfoSec_Policy_v2.0.pdf",
        fileSize: 2304512,
        fileType: "application/pdf",
        uploadedBy: "1",
        uploadedAt: "2023-07-20",
        changes: "Added cloud security guidelines and remote work policies",
      },
      {
        id: "v3",
        versionNumber: "2.1",
        fileName: "InfoSec_Policy_v2.1.pdf",
        fileSize: 2456789,
        fileType: "application/pdf",
        uploadedBy: "1",
        uploadedAt: "2024-01-10",
        changes: "Updated encryption standards and added AI/ML security guidelines",
      },
    ],
    createdBy: "1",
    createdAt: "2023-01-15",
    reviewerId: "9",
    approverId: "1",
    approvedAt: "2024-01-15",
    nextReviewDate: "2025-01-15",
    reviewFrequency: "annually",
    tags: ["security", "data-protection", "access-control"],
    isActive: true,
  },
]

const SAMPLE_RBI_OBSERVATIONS: RBIObservation[] = [
  // RMP (Risk Management and Processes) - 2024
  {
    id: "1",
    observationNumber: "RBI/AUDIT/2024/001",
    auditDate: "2024-01-15",
    auditType: "Statutory Audit",
    auditCategory: "RMP",
    category: "KYC Compliance",
    severity: "Critical",
    title: "Inadequate KYC Documentation",
    description: "Several customer accounts found with incomplete KYC documentation and missing risk categorization",
    recommendation: "Strengthen KYC processes and ensure complete documentation for all customers",
    assignedDepartment: "Operations",
    assignedTo: "Amit Patel",
    targetDate: "2024-03-15",
    status: "Closed",
    progress: 100,
    actionTaken: "Implemented comprehensive KYC review process and updated all incomplete documentation",
    evidenceUploaded: ["kyc_compliance_report.pdf", "updated_kyc_procedures.pdf"],
    lastUpdated: "2024-03-10",
    createdAt: "2024-01-20",
    createdBy: "1",
    closureDate: "2024-03-10",
    reviewComments: "Satisfactory implementation of recommendations",
    departmentComments: "All KYC documentation has been updated and processes strengthened",
  },
  {
    id: "2",
    observationNumber: "RBI/AUDIT/2024/002",
    auditDate: "2024-02-10",
    auditType: "Risk Assessment Review",
    auditCategory: "RMP",
    category: "Credit Risk Management",
    severity: "High",
    title: "Inadequate Credit Risk Assessment Framework",
    description: "Credit risk assessment models lack proper validation and stress testing mechanisms",
    recommendation: "Implement robust credit risk models with regular validation and stress testing",
    assignedDepartment: "Finance",
    assignedTo: "Arjun Mehta",
    targetDate: "2024-06-30",
    status: "In Progress",
    progress: 65,
    actionTaken: "New credit risk models developed and currently under testing phase",
    evidenceUploaded: ["credit_risk_model_v2.pdf"],
    lastUpdated: "2024-05-15",
    createdAt: "2024-02-15",
    createdBy: "1",
    departmentComments: "Models are being fine-tuned based on historical data analysis",
  },
  {
    id: "3",
    observationNumber: "RBI/AUDIT/2024/003",
    auditDate: "2024-03-05",
    auditType: "Operational Risk Review",
    auditCategory: "RMP",
    category: "Operational Risk",
    severity: "Medium",
    title: "Business Continuity Plan Gaps",
    description: "Business continuity plan lacks comprehensive disaster recovery procedures for critical systems",
    recommendation: "Update BCP with detailed DR procedures and conduct regular testing",
    assignedDepartment: "IT",
    assignedTo: "Ananya Reddy",
    targetDate: "2024-08-15",
    status: "Open",
    progress: 25,
    actionTaken: "Initial assessment completed, working on comprehensive BCP update",
    evidenceUploaded: ["bcp_assessment_report.pdf"],
    lastUpdated: "2024-04-20",
    createdAt: "2024-03-10",
    createdBy: "1",
    departmentComments: "Coordinating with external DR service providers",
  },

  // IRAR (Internal Risk Assessment and Rating) - 2024
  {
    id: "4",
    observationNumber: "RBI/AUDIT/2024/004",
    auditDate: "2024-02-20",
    auditType: "Internal Audit Review",
    auditCategory: "IRAR",
    category: "Internal Controls",
    severity: "Critical",
    title: "Weak Internal Control Framework",
    description: "Internal control mechanisms are insufficient to prevent unauthorized transactions",
    recommendation: "Strengthen internal controls with multi-level authorization and monitoring",
    assignedDepartment: "Operations",
    assignedTo: "Priya Sharma",
    targetDate: "2024-05-30",
    status: "Pending Closure",
    progress: 90,
    actionTaken: "Multi-level authorization system implemented and tested successfully",
    evidenceUploaded: ["internal_controls_framework.pdf", "authorization_matrix.pdf"],
    lastUpdated: "2024-05-25",
    createdAt: "2024-02-25",
    createdBy: "1",
    departmentComments: "System is live and monitoring reports are being generated daily",
  },
  {
    id: "5",
    observationNumber: "RBI/AUDIT/2024/005",
    auditDate: "2024-04-10",
    auditType: "Risk Rating Review",
    auditCategory: "IRAR",
    category: "Risk Assessment",
    severity: "High",
    title: "Inconsistent Risk Rating Methodology",
    description: "Risk rating methodology varies across different business units leading to inconsistent assessments",
    recommendation: "Standardize risk rating methodology across all business units",
    assignedDepartment: "Legal",
    assignedTo: "Rohit Agarwal",
    targetDate: "2024-07-31",
    status: "In Progress",
    progress: 45,
    actionTaken: "Standardized methodology document prepared and under review",
    evidenceUploaded: ["risk_rating_methodology_v3.pdf"],
    lastUpdated: "2024-06-10",
    createdAt: "2024-04-15",
    createdBy: "1",
    departmentComments: "Training sessions planned for all business units",
  },

  // SSI (System and Security Infrastructure) - 2024
  {
    id: "6",
    observationNumber: "RBI/AUDIT/2024/006",
    auditDate: "2024-03-15",
    auditType: "IT Security Audit",
    auditCategory: "SSI",
    category: "Cybersecurity",
    severity: "Critical",
    title: "Inadequate Cybersecurity Controls",
    description: "Multiple vulnerabilities identified in network security and endpoint protection systems",
    recommendation: "Implement comprehensive cybersecurity framework with advanced threat detection",
    assignedDepartment: "IT",
    assignedTo: "Deepika Joshi",
    targetDate: "2024-06-30",
    status: "Overdue",
    progress: 30,
    actionTaken: "Security assessment completed, procurement of security tools in progress",
    evidenceUploaded: ["security_assessment_report.pdf"],
    lastUpdated: "2024-07-01",
    createdAt: "2024-03-20",
    createdBy: "1",
    departmentComments: "Delays due to vendor selection process, expected completion by August",
  },
  {
    id: "7",
    observationNumber: "RBI/AUDIT/2024/007",
    auditDate: "2024-05-08",
    auditType: "Infrastructure Review",
    auditCategory: "SSI",
    category: "System Infrastructure",
    severity: "Medium",
    title: "Outdated System Infrastructure",
    description: "Core banking systems running on outdated infrastructure with limited scalability",
    recommendation: "Upgrade system infrastructure to support current and future business requirements",
    assignedDepartment: "IT",
    assignedTo: "Admin",
    targetDate: "2024-12-31",
    status: "Open",
    progress: 15,
    actionTaken: "Infrastructure assessment completed, upgrade plan being finalized",
    evidenceUploaded: ["infrastructure_assessment.pdf"],
    lastUpdated: "2024-06-15",
    createdAt: "2024-05-13",
    createdBy: "1",
    departmentComments: "Budget approval pending for infrastructure upgrade",
  },

  // MNCR (Money Laundering and Non-Compliance Risk) - 2024
  {
    id: "8",
    observationNumber: "RBI/AUDIT/2024/008",
    auditDate: "2024-04-25",
    auditType: "AML Compliance Review",
    auditCategory: "MNCR",
    category: "Anti-Money Laundering",
    severity: "High",
    title: "Inadequate AML Transaction Monitoring",
    description: "AML transaction monitoring system has gaps in detecting suspicious transaction patterns",
    recommendation: "Enhance AML monitoring system with advanced analytics and pattern recognition",
    assignedDepartment: "Compliance",
    assignedTo: "Rajesh Kumar",
    targetDate: "2024-08-31",
    status: "In Progress",
    progress: 55,
    actionTaken: "New AML monitoring system procured and configuration in progress",
    evidenceUploaded: ["aml_system_specs.pdf", "configuration_guide.pdf"],
    lastUpdated: "2024-07-10",
    createdAt: "2024-04-30",
    createdBy: "1",
    departmentComments: "System testing phase initiated, training materials being prepared",
  },
  {
    id: "9",
    observationNumber: "RBI/AUDIT/2024/009",
    auditDate: "2024-06-12",
    auditType: "Compliance Review",
    auditCategory: "MNCR",
    category: "Regulatory Compliance",
    severity: "Medium",
    title: "Delayed Regulatory Reporting",
    description: "Several regulatory reports submitted beyond prescribed timelines",
    recommendation: "Implement automated reporting system with built-in compliance calendars",
    assignedDepartment: "Compliance",
    assignedTo: "Meera Patel",
    targetDate: "2024-09-30",
    status: "Open",
    progress: 20,
    actionTaken: "Compliance calendar created and reporting process review initiated",
    evidenceUploaded: ["compliance_calendar_2024.pdf"],
    lastUpdated: "2024-07-05",
    createdAt: "2024-06-17",
    createdBy: "1",
    departmentComments: "Automation tools evaluation in progress",
  },

  // 2023 Observations
  {
    id: "10",
    observationNumber: "RBI/AUDIT/2023/010",
    auditDate: "2023-11-15",
    auditType: "Annual Statutory Audit",
    auditCategory: "RMP",
    category: "Liquidity Risk",
    severity: "High",
    title: "Insufficient Liquidity Buffer",
    description: "Liquidity coverage ratio falls below regulatory requirements during stress scenarios",
    recommendation: "Maintain adequate liquidity buffer and improve liquidity risk management framework",
    assignedDepartment: "Finance",
    assignedTo: "Arjun Mehta",
    targetDate: "2024-02-28",
    status: "Closed",
    progress: 100,
    actionTaken: "Liquidity management framework enhanced and buffer increased to meet regulatory requirements",
    evidenceUploaded: ["liquidity_framework_v2.pdf", "lcr_compliance_report.pdf"],
    lastUpdated: "2024-02-25",
    createdAt: "2023-11-20",
    createdBy: "1",
    closureDate: "2024-02-25",
    reviewComments: "Liquidity position significantly improved and meets all regulatory requirements",
    departmentComments: "Monthly liquidity stress testing now implemented",
  },
  {
    id: "11",
    observationNumber: "RBI/AUDIT/2023/011",
    auditDate: "2023-09-20",
    auditType: "IT Security Audit",
    auditCategory: "SSI",
    category: "Data Security",
    severity: "Critical",
    title: "Customer Data Protection Gaps",
    description: "Customer data encryption standards do not meet current regulatory requirements",
    recommendation: "Implement advanced encryption standards for customer data protection",
    assignedDepartment: "IT",
    assignedTo: "Ananya Reddy",
    targetDate: "2024-01-31",
    status: "Closed",
    progress: 100,
    actionTaken: "Advanced encryption implemented across all customer data repositories",
    evidenceUploaded: ["encryption_implementation_report.pdf", "data_security_audit.pdf"],
    lastUpdated: "2024-01-28",
    createdAt: "2023-09-25",
    createdBy: "1",
    closureDate: "2024-01-28",
    reviewComments: "Encryption standards now exceed regulatory requirements",
    departmentComments: "Regular security audits scheduled quarterly",
  },
  {
    id: "12",
    observationNumber: "RBI/AUDIT/2023/012",
    auditDate: "2023-08-10",
    auditType: "Internal Audit Review",
    auditCategory: "IRAR",
    category: "Audit Trail",
    severity: "Medium",
    title: "Incomplete Audit Trail Maintenance",
    description: "System audit trails are not comprehensive and lack proper retention policies",
    recommendation: "Implement comprehensive audit trail system with proper retention and archival policies",
    assignedDepartment: "IT",
    assignedTo: "Deepika Joshi",
    targetDate: "2023-12-31",
    status: "Closed",
    progress: 100,
    actionTaken: "Comprehensive audit trail system implemented with 7-year retention policy",
    evidenceUploaded: ["audit_trail_system_specs.pdf", "retention_policy.pdf"],
    lastUpdated: "2023-12-28",
    createdAt: "2023-08-15",
    createdBy: "1",
    closureDate: "2023-12-28",
    reviewComments: "Audit trail system meets all regulatory requirements",
    departmentComments: "Automated archival process implemented",
  },
  {
    id: "13",
    observationNumber: "RBI/AUDIT/2023/013",
    auditDate: "2023-10-05",
    auditType: "AML Compliance Review",
    auditCategory: "MNCR",
    category: "Suspicious Transaction Reporting",
    severity: "High",
    title: "Delayed STR Filing",
    description: "Suspicious Transaction Reports (STRs) not filed within prescribed timelines",
    recommendation: "Implement automated STR generation and filing system with proper escalation matrix",
    assignedDepartment: "Compliance",
    assignedTo: "Rajesh Kumar",
    targetDate: "2024-03-31",
    status: "Closed",
    progress: 100,
    actionTaken: "Automated STR system implemented with real-time monitoring and escalation",
    evidenceUploaded: ["str_automation_system.pdf", "escalation_matrix.pdf"],
    lastUpdated: "2024-03-28",
    createdAt: "2023-10-10",
    createdBy: "1",
    closureDate: "2024-03-28",
    reviewComments: "STR filing process significantly improved with zero delays in recent months",
    departmentComments: "Monthly compliance reports show 100% on-time STR filing",
  },

  // 2022 Observations
  {
    id: "14",
    observationNumber: "RBI/AUDIT/2022/014",
    auditDate: "2022-12-08",
    auditType: "Risk Management Review",
    auditCategory: "RMP",
    category: "Market Risk",
    severity: "Medium",
    title: "Market Risk Measurement Gaps",
    description: "Market risk measurement models lack proper back-testing and validation procedures",
    recommendation: "Implement robust back-testing framework for market risk models",
    assignedDepartment: "Finance",
    assignedTo: "Arjun Mehta",
    targetDate: "2023-06-30",
    status: "Closed",
    progress: 100,
    actionTaken: "Back-testing framework implemented with monthly validation procedures",
    evidenceUploaded: ["market_risk_backtesting_framework.pdf", "validation_results_2023.pdf"],
    lastUpdated: "2023-06-28",
    createdAt: "2022-12-13",
    createdBy: "1",
    closureDate: "2023-06-28",
    reviewComments: "Market risk models now have comprehensive validation framework",
    departmentComments: "Monthly back-testing reports show model accuracy within acceptable limits",
  },
  {
    id: "15",
    observationNumber: "RBI/AUDIT/2022/015",
    auditDate: "2022-11-22",
    auditType: "Operational Review",
    auditCategory: "SSI",
    category: "Business Continuity",
    severity: "High",
    title: "Inadequate Disaster Recovery Testing",
    description: "Disaster recovery procedures not tested regularly and lack proper documentation",
    recommendation: "Conduct regular DR testing and maintain comprehensive documentation",
    assignedDepartment: "IT",
    assignedTo: "Admin",
    targetDate: "2023-05-31",
    status: "Closed",
    progress: 100,
    actionTaken: "Quarterly DR testing implemented with comprehensive documentation and reporting",
    evidenceUploaded: ["dr_testing_schedule.pdf", "dr_test_results_2023.pdf"],
    lastUpdated: "2023-05-28",
    createdAt: "2022-11-27",
    createdBy: "1",
    closureDate: "2023-05-28",
    reviewComments: "DR testing framework is now robust and well-documented",
    departmentComments: "All DR tests in 2023 completed successfully within target RTOs",
  },
]

// Storage functions
export function initializeStorage(): void {
  if (typeof window === "undefined") return

  const isInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED)

  if (!isInitialized) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SAMPLE_USERS))
    localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(SAMPLE_DEPARTMENTS))
    localStorage.setItem(STORAGE_KEYS.REGULATORY_DEPARTMENTS, JSON.stringify(SAMPLE_REGULATORY_DEPARTMENTS))
    localStorage.setItem(STORAGE_KEYS.CHECKPOINTS, JSON.stringify(SAMPLE_CHECKPOINTS))
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify([]))
    localStorage.setItem(STORAGE_KEYS.POLICIES_SOPS, JSON.stringify(SAMPLE_POLICIES_SOPS))
    localStorage.setItem(STORAGE_KEYS.RBI_OBSERVATIONS, JSON.stringify(SAMPLE_RBI_OBSERVATIONS))
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(SAMPLE_USERS[0]))
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, "true")
  }
}

// User functions
export function getUsers(): User[] {
  if (typeof window === "undefined") return []
  const users = localStorage.getItem(STORAGE_KEYS.USERS)
  return users ? JSON.parse(users) : []
}

export function saveUsers(users: User[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
}

export function addUser(user: Omit<User, "id" | "createdAt">): User {
  const users = getUsers()
  const newUser: User = {
    ...user,
    id: Date.now().toString(),
    createdAt: new Date().toISOString().split("T")[0],
  }
  users.push(newUser)
  saveUsers(users)
  return newUser
}

export function updateUser(id: string, updates: Partial<User>): User | null {
  const users = getUsers()
  const index = users.findIndex((u) => u.id === id)
  if (index === -1) return null

  users[index] = { ...users[index], ...updates }
  saveUsers(users)
  return users[index]
}

export function deleteUser(id: string): boolean {
  const users = getUsers()
  const filteredUsers = users.filter((u) => u.id !== id)
  if (filteredUsers.length === users.length) return false

  saveUsers(filteredUsers)
  return true
}

// Department functions
export function getDepartments(): Department[] {
  if (typeof window === "undefined") return []
  const departments = localStorage.getItem(STORAGE_KEYS.DEPARTMENTS)
  return departments ? JSON.parse(departments) : []
}

export function saveDepartments(departments: Department[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(departments))
}

export function addDepartment(department: Omit<Department, "id" | "createdAt">): Department {
  const departments = getDepartments()
  const newDepartment: Department = {
    ...department,
    id: Date.now().toString(),
    createdAt: new Date().toISOString().split("T")[0],
  }
  departments.push(newDepartment)
  saveDepartments(departments)
  return newDepartment
}

export function updateDepartment(id: string, updates: Partial<Department>): Department | null {
  const departments = getDepartments()
  const index = departments.findIndex((d) => d.id === id)
  if (index === -1) return null

  departments[index] = { ...departments[index], ...updates }
  saveDepartments(departments)
  return departments[index]
}

// Regulatory Department functions
export function getRegulatoryDepartments(): RegulatoryDepartment[] {
  if (typeof window === "undefined") return []
  const regulatoryDepts = localStorage.getItem(STORAGE_KEYS.REGULATORY_DEPARTMENTS)
  return regulatoryDepts ? JSON.parse(regulatoryDepts) : []
}

export function saveRegulatoryDepartments(regulatoryDepts: RegulatoryDepartment[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.REGULATORY_DEPARTMENTS, JSON.stringify(regulatoryDepts))
}

export function addRegulatoryDepartment(
  regulatoryDept: Omit<RegulatoryDepartment, "id" | "createdAt">,
): RegulatoryDepartment {
  const regulatoryDepts = getRegulatoryDepartments()
  const newRegulatoryDept: RegulatoryDepartment = {
    ...regulatoryDept,
    id: Date.now().toString(),
    createdAt: new Date().toISOString().split("T")[0],
  }
  regulatoryDepts.push(newRegulatoryDept)
  saveRegulatoryDepartments(regulatoryDepts)
  return newRegulatoryDept
}

export function updateRegulatoryDepartment(
  id: string,
  updates: Partial<RegulatoryDepartment>,
): RegulatoryDepartment | null {
  const regulatoryDepts = getRegulatoryDepartments()
  const index = regulatoryDepts.findIndex((d) => d.id === id)
  if (index === -1) return null

  regulatoryDepts[index] = { ...regulatoryDepts[index], ...updates }
  saveRegulatoryDepartments(regulatoryDepts)
  return regulatoryDepts[index]
}

// Checkpoint functions
export function getCheckpoints(): Checkpoint[] {
  if (typeof window === "undefined") return []
  const checkpoints = localStorage.getItem(STORAGE_KEYS.CHECKPOINTS)
  return checkpoints ? JSON.parse(checkpoints) : []
}

export function saveCheckpoints(checkpoints: Checkpoint[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.CHECKPOINTS, JSON.stringify(checkpoints))
}

export function addCheckpoint(checkpoint: Omit<Checkpoint, "id" | "createdAt">): Checkpoint {
  const checkpoints = getCheckpoints()
  const newCheckpoint: Checkpoint = {
    ...checkpoint,
    id: Date.now().toString(),
    createdAt: new Date().toISOString().split("T")[0],
    subCheckpoints: checkpoint.subCheckpoints.map((sub, index) => ({
      ...sub,
      id: `${Date.now()}_${index}`,
    })),
  }
  checkpoints.push(newCheckpoint)
  saveCheckpoints(checkpoints)
  return newCheckpoint
}

export function updateCheckpoint(id: string, updates: Partial<Checkpoint>): Checkpoint | null {
  const checkpoints = getCheckpoints()
  const index = checkpoints.findIndex((c) => c.id === id)
  if (index === -1) return null

  checkpoints[index] = { ...checkpoints[index], ...updates }
  saveCheckpoints(checkpoints)
  return checkpoints[index]
}

export function updateSubCheckpoint(
  checkpointId: string,
  subCheckpointId: string,
  updates: Partial<SubCheckpoint>,
): boolean {
  const checkpoints = getCheckpoints()
  const checkpointIndex = checkpoints.findIndex((c) => c.id === checkpointId)
  if (checkpointIndex === -1) return false

  const subCheckpointIndex = checkpoints[checkpointIndex].subCheckpoints.findIndex((s) => s.id === subCheckpointId)
  if (subCheckpointIndex === -1) return false

  checkpoints[checkpointIndex].subCheckpoints[subCheckpointIndex] = {
    ...checkpoints[checkpointIndex].subCheckpoints[subCheckpointIndex],
    ...updates,
  }

  saveCheckpoints(checkpoints)
  return true
}

// Submission functions
export function getSubmissions(): Submission[] {
  if (typeof window === "undefined") return []
  const submissions = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS)
  return submissions ? JSON.parse(submissions) : []
}

export function saveSubmissions(submissions: Submission[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions))
}

export function addSubmission(submission: Omit<Submission, "id">): Submission {
  const submissions = getSubmissions()
  const newSubmission: Submission = {
    ...submission,
    id: Date.now().toString(),
  }
  submissions.push(newSubmission)
  saveSubmissions(submissions)
  return newSubmission
}

export function updateSubmission(id: string, updates: Partial<Submission>): Submission | null {
  const submissions = getSubmissions()
  const index = submissions.findIndex((s) => s.id === id)
  if (index === -1) return null

  submissions[index] = { ...submissions[index], ...updates }
  saveSubmissions(submissions)
  return submissions[index]
}

// Policy/SOP functions
export function getPolicyDocuments(): PolicySOP[] {
  if (typeof window === "undefined") return []
  const policiesSOPs = localStorage.getItem(STORAGE_KEYS.POLICIES_SOPS)
  return policiesSOPs ? JSON.parse(policiesSOPs) : []
}

export function getPoliciesSOPs(): PolicySOP[] {
  return getPolicyDocuments()
}

export function savePoliciesSOPs(policiesSOPs: PolicySOP[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.POLICIES_SOPS, JSON.stringify(policiesSOPs))
}

export function addPolicyDocument(document: Omit<PolicySOP, "id" | "createdAt">): PolicySOP {
  const policiesSOPs = getPoliciesSOPs()
  const newPolicySOP: PolicySOP = {
    ...document,
    id: Date.now().toString(),
    createdAt: new Date().toISOString().split("T")[0],
  }
  policiesSOPs.push(newPolicySOP)
  savePoliciesSOPs(policiesSOPs)
  return newPolicySOP
}

export function addPolicySOP(policySOP: Omit<PolicySOP, "id" | "createdAt">): PolicySOP {
  return addPolicyDocument(policySOP)
}

export function updatePolicyDocument(id: string, updates: Partial<PolicySOP>): PolicySOP | null {
  const policiesSOPs = getPoliciesSOPs()
  const index = policiesSOPs.findIndex((p) => p.id === id)
  if (index === -1) return null

  policiesSOPs[index] = { ...policiesSOPs[index], ...updates }
  savePoliciesSOPs(policiesSOPs)
  return policiesSOPs[index]
}

export function updatePolicySOP(id: string, updates: Partial<PolicySOP>): PolicySOP | null {
  return updatePolicyDocument(id, updates)
}

export function addVersionToPolicySOP(policySOPId: string, version: Omit<DocumentVersion, "id">): PolicySOP | null {
  const policiesSOPs = getPoliciesSOPs()
  const index = policiesSOPs.findIndex((p) => p.id === policySOPId)
  if (index === -1) return null

  const newVersion: DocumentVersion = {
    ...version,
    id: `v${Date.now()}`,
  }

  policiesSOPs[index].versions.push(newVersion)
  policiesSOPs[index].currentVersion = newVersion.versionNumber

  savePoliciesSOPs(policiesSOPs)
  return policiesSOPs[index]
}

// Current user functions
export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null
  const currentUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
  return currentUser ? JSON.parse(currentUser) : null
}

export function setCurrentUser(user: User): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user))
}

export function clearCurrentUser(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
}

export function logoutUser(): void {
  clearCurrentUser()
}

export function loginUser(email: string, password: string): User | null {
  return authenticateUser(email, password)
}

// Authentication functions
export function authenticateUser(email: string, password: string): User | null {
  const users = getUsers()
  // Simple authentication - in real app, you'd hash passwords
  const user = users.find((u) => u.email === email && u.status === "Active")

  if (
    user &&
    ((email === "admin@trik.com" && password === "admin123") ||
      (email === "priya.sharma@trik.com" && password === "priya123") ||
      (email === "amit.patel@trik.com" && password === "amit123") ||
      (email === "rohit.agarwal@trik.com" && password === "rohit123"))
  ) {
    setCurrentUser(user)
    return user
  }

  return null
}

// Utility functions
export function getCheckpointStatus(subCheckpoints: SubCheckpoint[]): string {
  // A checkpoint is overdue if ANY sub-checkpoint is overdue
  const hasOverdue = subCheckpoints.some((sub) => sub.status === "overdue")
  if (hasOverdue) return "overdue"

  // A checkpoint is non-compliant if ANY sub-checkpoint is non-compliant OR pending
  const hasNonCompliant = subCheckpoints.some((sub) => sub.status === "non-compliant")
  const hasPending = subCheckpoints.some((sub) => sub.status === "pending")
  if (hasNonCompliant || hasPending) return "non-compliant"

  // A checkpoint is compliant only if ALL sub-checkpoints are compliant
  const allCompliant = subCheckpoints.every((sub) => sub.status === "compliant")
  if (allCompliant) return "compliant"

  // Default fallback
  return "non-compliant"
}

export function getComplianceStats(checkpointType?: CheckpointType, period?: string) {
  const checkpoints = getCheckpoints()
  const filteredCheckpoints = checkpoints.filter((checkpoint) => {
    // Filter by checkpoint type if provided
    if (checkpointType && checkpoint.type !== checkpointType) {
      return false
    }

    // For ad-hoc checkpoints, filter by financial year if provided
    if (checkpoint.type === "ad-hoc" && period && checkpoint.financialYear !== period) {
      return false
    }

    // For recurring checkpoints, filter by period if provided
    if (checkpoint.type === "recurring" && period) {
      // Check if any subcheckpoint has the matching period
      return checkpoint.subCheckpoints.some((sub) => {
        if (!sub.period) return false

        // Match based on frequency
        if (checkpoint.frequency === "monthly" && period.startsWith("2024-")) {
          return sub.period === period
        } else if (checkpoint.frequency === "quarterly" && period.includes("Q")) {
          return sub.period === period
        } else if (checkpoint.frequency === "half-yearly" && period.includes("H")) {
          return sub.period === period
        } else if (checkpoint.frequency === "annually") {
          return sub.period.startsWith(period)
        }

        return false
      })
    }

    return true
  })

  const stats = {
    total: filteredCheckpoints.length,
    compliant: 0,
    pending: 0,
    overdue: 0,
    nonCompliant: 0,
  }

  filteredCheckpoints.forEach((checkpoint) => {
    const status = getCheckpointStatus(checkpoint.subCheckpoints)
    switch (status) {
      case "compliant":
        stats.compliant++
        break
      case "pending":
        stats.pending++
        break
      case "overdue":
        stats.overdue++
        break
      case "non-compliant":
        stats.nonCompliant++
        break
    }
  })

  return stats
}

export function getRegulatoryStats(checkpointType?: CheckpointType, period?: string) {
  const checkpoints = getCheckpoints()
  const regulatoryDepts = getRegulatoryDepartments()

  return regulatoryDepts.map((regDept) => {
    // Filter checkpoints by regulatory department and optional filters
    const deptCheckpoints = checkpoints.filter((cp) => {
      if (cp.regulatory !== regDept.name) return false

      // Filter by checkpoint type if provided
      if (checkpointType && cp.type !== checkpointType) {
        return false
      }

      // For ad-hoc checkpoints, filter by financial year if provided
      if (cp.type === "ad-hoc" && period && cp.financialYear !== period) {
        return false
      }

      // For recurring checkpoints, filter by period if provided
      if (cp.type === "recurring" && period) {
        // Check if any subcheckpoint has the matching period
        return cp.subCheckpoints.some((sub) => {
          if (!sub.period) return false

          // Match based on frequency
          if (cp.frequency === "monthly" && period.startsWith("2024-")) {
            return sub.period === period
          } else if (cp.frequency === "quarterly" && period.includes("Q")) {
            return sub.period === period
          } else if (cp.frequency === "half-yearly" && period.includes("H")) {
            return sub.period === period
          } else if (cp.frequency === "annually") {
            return sub.period.startsWith(period)
          }

          return false
        })
      }

      return true
    })

    const statusCounts = {
      compliant: 0,
      pending: 0,
      overdue: 0,
      nonCompliant: 0,
    }

    deptCheckpoints.forEach((checkpoint) => {
      const status = getCheckpointStatus(checkpoint.subCheckpoints)
      switch (status) {
        case "compliant":
          statusCounts.compliant++
          break
        case "pending":
          statusCounts.pending++
          break
        case "overdue":
          statusCounts.overdue++
          break
        case "non-compliant":
          statusCounts.nonCompliant++
          break
      }
    })

    const total = deptCheckpoints.length
    const percentage = total > 0 ? Math.round((statusCounts.compliant / total) * 100) : 0

    return {
      name: regDept.name,
      fullName: regDept.fullName,
      criticality: regDept.criticality,
      spoc: regDept.spoc,
      total,
      compliant: statusCounts.compliant,
      pending: statusCounts.pending,
      overdue: statusCounts.overdue,
      nonCompliant: statusCounts.nonCompliant,
      percentage,
      checkpoints: deptCheckpoints,
    }
  })
}

export function getCriticalityOrder(criticality: string): number {
  switch (criticality) {
    case "Critical":
      return 1
    case "High":
      return 2
    case "Medium":
      return 3
    case "Low":
      return 4
    default:
      return 5
  }
}

// Policy/SOP utility functions
export function getPolicySOPStats() {
  const policiesSOPs = getPoliciesSOPs()
  const now = new Date()
  const threeMonthsFromNow = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000)

  const stats = {
    total: policiesSOPs.filter((p) => p.isActive).length,
    policies: policiesSOPs.filter((p) => p.type === "policy" && p.isActive).length,
    sops: policiesSOPs.filter((p) => p.type === "sop" && p.isActive).length,
    approved: policiesSOPs.filter((p) => p.status === "approved" && p.isActive).length,
    underReview: policiesSOPs.filter((p) => p.status === "under_review" && p.isActive).length,
    draft: policiesSOPs.filter((p) => p.status === "draft" && p.isActive).length,
    nearingReview: policiesSOPs.filter((p) => {
      if (!p.isActive) return false
      const reviewDate = new Date(p.nextReviewDate)
      return reviewDate <= threeMonthsFromNow && reviewDate >= now
    }).length,
    overdue: policiesSOPs.filter((p) => {
      if (!p.isActive) return false
      const reviewDate = new Date(p.nextReviewDate)
      return reviewDate < now
    }).length,
  }

  return stats
}

// Helper functions for time periods
export function getFinancialYears(): string[] {
  const currentYear = new Date().getFullYear()
  return [
    `${currentYear - 2}-${currentYear - 1}`,
    `${currentYear - 1}-${currentYear}`,
    `${currentYear}-${currentYear + 1}`,
  ]
}

export function getMonths(): { value: string; label: string }[] {
  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ]

  const currentYear = new Date().getFullYear()
  return months.map((month) => ({
    value: `${currentYear}-${month.value}`,
    label: `${month.label} ${currentYear}`,
  }))
}

export function getQuarters(): { value: string; label: string }[] {
  const currentYear = new Date().getFullYear()
  return [
    { value: `${currentYear}-Q1`, label: `Q1 ${currentYear} (Jan-Mar)` },
    { value: `${currentYear}-Q2`, label: `Q2 ${currentYear} (Apr-Jun)` },
    { value: `${currentYear}-Q3`, label: `Q3 ${currentYear} (Jul-Sep)` },
    { value: `${currentYear}-Q4`, label: `Q4 ${currentYear} (Oct-Dec)` },
  ]
}

export function getHalfYears(): { value: string; label: string }[] {
  const currentYear = new Date().getFullYear()
  return [
    { value: `${currentYear}-H1`, label: `H1 ${currentYear} (Jan-Jun)` },
    { value: `${currentYear}-H2`, label: `H2 ${currentYear} (Jul-Dec)` },
  ]
}

export function getYears(): { value: string; label: string }[] {
  const currentYear = new Date().getFullYear()
  return [
    { value: `${currentYear - 1}`, label: `${currentYear - 1}` },
    { value: `${currentYear}`, label: `${currentYear}` },
    { value: `${currentYear + 1}`, label: `${currentYear + 1}` },
  ]
}

// File utility functions
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export function downloadFile(fileName: string, content: string, mimeType = "application/octet-stream") {
  const blob = new Blob([content], { type: mimeType })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

// RBI Observation functions
export function getRBIObservations(): RBIObservation[] {
  if (typeof window === "undefined") return []
  const observations = localStorage.getItem(STORAGE_KEYS.RBI_OBSERVATIONS)
  return observations ? JSON.parse(observations) : []
}

export function saveRBIObservations(observations: RBIObservation[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.RBI_OBSERVATIONS, JSON.stringify(observations))
}

export function addRBIObservation(
  observation: Omit<RBIObservation, "id" | "createdAt" | "lastUpdated">,
): RBIObservation {
  const observations = getRBIObservations()
  const newObservation: RBIObservation = {
    ...observation,
    id: Date.now().toString(),
    createdAt: new Date().toISOString().split("T")[0],
    lastUpdated: new Date().toISOString().split("T")[0],
  }
  observations.push(newObservation)
  saveRBIObservations(observations)
  return newObservation
}

export function updateRBIObservation(id: string, updates: Partial<RBIObservation>): RBIObservation | null {
  const observations = getRBIObservations()
  const index = observations.findIndex((o) => o.id === id)
  if (index === -1) return null

  // If status is changing to Closed, add closure date
  if (updates.status === "Closed" && observations[index].status !== "Closed") {
    updates.closureDate = new Date().toISOString().split("T")[0]
  }

  observations[index] = {
    ...observations[index],
    ...updates,
    lastUpdated: new Date().toISOString().split("T")[0],
  }
  saveRBIObservations(observations)
  return observations[index]
}

export function deleteRBIObservation(id: string): boolean {
  const observations = getRBIObservations()
  const filteredObservations = observations.filter((o) => o.id !== id)
  if (filteredObservations.length === observations.length) return false

  saveRBIObservations(filteredObservations)
  return true
}

// RBI Audit utility functions
export function getRBIAuditStats() {
  const observations = getRBIObservations()

  const stats = {
    total: observations.length,
    open: observations.filter((o) => o.status === "Open").length,
    inProgress: observations.filter((o) => o.status === "In Progress").length,
    pendingClosure: observations.filter((o) => o.status === "Pending Closure").length,
    closed: observations.filter((o) => o.status === "Closed").length,
    overdue: observations.filter((o) => o.status === "Overdue").length,
    critical: observations.filter((o) => o.severity === "Critical").length,
    high: observations.filter((o) => o.severity === "High").length,
    medium: observations.filter((o) => o.severity === "Medium").length,
    low: observations.filter((o) => o.severity === "Low").length,
  }

  return stats
}

export function getRBIDepartmentStats() {
  const observations = getRBIObservations()
  const departments = getDepartments()

  return departments
    .map((dept) => {
      const deptObservations = observations.filter((o) => o.assignedDepartment === dept.name)

      const stats = {
        department: dept.name,
        total: deptObservations.length,
        open: deptObservations.filter((o) => o.status === "Open").length,
        inProgress: deptObservations.filter((o) => o.status === "In Progress").length,
        pendingClosure: deptObservations.filter((o) => o.status === "Pending Closure").length,
        closed: deptObservations.filter((o) => o.status === "Closed").length,
        overdue: deptObservations.filter((o) => o.status === "Overdue").length,
        critical: deptObservations.filter((o) => o.severity === "Critical").length,
        high: deptObservations.filter((o) => o.severity === "High").length,
        avgProgress:
          deptObservations.length > 0
            ? Math.round(deptObservations.reduce((sum, o) => sum + o.progress, 0) / deptObservations.length)
            : 0,
        observations: deptObservations,
      }

      return stats
    })
    .filter((dept) => dept.total > 0)
}

// Additional utility functions for backward compatibility
export function getReviews(): any[] {
  return []
}

export function addReview(review: any): any {
  return review
}

export function updateReview(id: string, updates: any): any {
  return null
}
