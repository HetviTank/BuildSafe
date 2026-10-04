// One entry per service page (/services/:slug).
// `art` picks the matching illustration from components/illustrations.

import {
  FaFireExtinguisher,
  FaChalkboardTeacher,
  FaCertificate,
  FaSearchPlus,
  FaClipboardCheck,
  FaDraftingCompass,
} from 'react-icons/fa'

export const services = [
  {
    slug: 'fire-safety',
    art: 'fire',
    icon: FaFireExtinguisher,
    title: 'Fire & Safety Services',
    tagline: 'Inspection, NOC support and equipment upkeep — under one roof.',
    summary:
      'End-to-end fire safety support, from compliance audits and Fire NOC documentation to extinguisher hydrotesting and PPE supply.',
    intro:
      'Fire safety is not a one-time certificate — it is a system that must work on the day it is needed. We inspect, test and maintain your fire protection assets and guide you through Fire NOC approvals in line with NBC guidelines and IS standards.',
    items: [
      {
        title: 'Fire Safety Inspection & Compliance Audit',
        points: [
          'Site inspection and risk assessment',
          'Compliance with Fire NOC and NBC guidelines',
          'Detailed audit report with recommendations',
        ],
      },
      {
        title: 'Fire NOC Support & Documentation',
        points: [
          'Fire NOC application assistance',
          'Documentation and liaison support',
          'Renewal and approval process guidance',
        ],
      },
      {
        title: 'Fire Alarm & Detection System Review',
        points: [
          'Smoke detector and alarm testing',
          'Control panel inspection',
          'System performance validation',
        ],
      },
      {
        title: 'Fire Extinguisher Inspection, Hydrotesting & Refilling',
        points: [
          'Certified safety maintenance',
          'High-pressure structural testing',
          'Quick refilling protocols',
        ],
      },
      {
        title: 'Fire Pump, Sprinkler & Hydrant System Inspection',
        points: [
          'Periodic pressure testing',
          'Flow diagnostics of automatic sprinklers',
          'Hydrant network health checks',
        ],
      },
      {
        title: 'Supply of PPEs & Specialized Safety Gear',
        points: [
          'Industrial personal protective gear & headwear',
          'Respiratory safety kits',
          'Fall-protection harnesses',
        ],
      },
    ],
  },
  {
    slug: 'health-safety-training',
    art: 'training',
    icon: FaChalkboardTeacher,
    title: 'Health & Safety Training',
    tagline: 'Prepared people are the strongest line of defence.',
    summary:
      'Emergency planning, evacuation drills and safety awareness programmes that prepare your workforce to act correctly under pressure.',
    intro:
      'Equipment alone cannot keep a site safe — people do. We prepare your teams with practical emergency plans, evacuation strategies and on-site drills, so everyone knows exactly what to do when it matters.',
    items: [
      {
        title: 'Onsite Emergency Plan Preparation & Implementation',
        points: [
          'Emergency response framework modelling',
          'Hazard evacuation strategy mapping',
          'Employee drill coordination',
        ],
      },
      {
        title: 'Emergency Evacuation Planning',
        points: [
          'Emergency response planning',
          'Exit route mapping',
          'Staff awareness and training support',
        ],
      },
      {
        title: 'Safety Awareness Programmes',
        points: [
          'Fire safety awareness for staff',
          'Correct use of PPE and safety gear',
          'Hazard reporting culture on the shop floor',
        ],
      },
    ],
  },
  {
    slug: 'iso-consulting',
    art: 'iso',
    icon: FaCertificate,
    title: 'ISO Consulting',
    tagline: 'Systems that earn certification — and keep it.',
    summary:
      'Guidance to build, document and maintain management systems that meet ISO requirements, from an ISO 9001:2015 certified team.',
    intro:
      'As an ISO 9001:2015 certified company ourselves, we understand what it takes to build a management system that works in practice. We help you prepare documentation, close gaps and get audit-ready with confidence.',
    items: [
      {
        title: 'Gap Assessment',
        points: [
          'Review of existing processes and records',
          'Identification of gaps against ISO requirements',
          'Prioritised action plan',
        ],
      },
      {
        title: 'Documentation & Implementation Support',
        points: [
          'Policies, procedures and formats',
          'Process mapping and responsibilities',
          'Guidance through implementation',
        ],
      },
      {
        title: 'Certification Readiness',
        points: [
          'Internal audit support',
          'Corrective action follow-up',
          'Preparation for certification audit',
        ],
      },
    ],
  },
  {
    slug: 'third-party-inspection',
    art: 'inspection',
    icon: FaSearchPlus,
    title: 'Third Party Inspection',
    tagline: 'Independent verification you can rely on.',
    summary:
      'Unbiased inspection of lifting equipment, tools and fire protection systems — with clear, documented findings.',
    intro:
      'An independent inspection gives you an honest picture of the condition of your equipment. Our engineers verify structural integrity, load capacity and system performance, and document every finding clearly.',
    items: [
      {
        title: 'Third-Party Inspection of Tools & Lifting Equipment',
        points: [
          'Structural and load capacity analysis',
          'Cranes, hooks and lifting tackles',
          'Warehouse tools and equipment',
        ],
      },
      {
        title: 'Fire Protection System Inspection',
        points: [
          'Fire pump performance checks',
          'Sprinkler and hydrant flow diagnostics',
          'Periodic pressure testing',
        ],
      },
      {
        title: 'Fire Alarm & Detection Verification',
        points: [
          'Detector and alarm testing',
          'Control panel inspection',
          'Performance validation report',
        ],
      },
    ],
  },
  {
    slug: 'audits',
    art: 'audit',
    icon: FaClipboardCheck,
    title: 'Audit Services',
    tagline: 'Find the gaps before an incident — or an inspector — does.',
    summary:
      'Statutory and customised safety audits, fire compliance audits and environmental audits with practical, prioritised recommendations.',
    intro:
      'Our audits combine on-ground evaluation with a clear understanding of statutory requirements. You receive a detailed report that explains each finding and recommends practical corrective actions.',
    items: [
      {
        title: 'Safety Audits (Statutory & Customized)',
        points: [
          'Factory floor hazard assessments',
          'Commercial premises hazard assessments',
          'Factory Rules compliance review',
        ],
      },
      {
        title: 'Fire Safety Compliance Audit',
        points: [
          'Site inspection and risk assessment',
          'Compliance with Fire NOC and NBC guidelines',
          'Detailed audit report with recommendations',
        ],
      },
      {
        title: 'Environment Audits & Compliance Support',
        points: [
          'Environmental impact tracking',
          'Waste regulations management',
          'Emission compliance',
        ],
      },
    ],
  },
  {
    slug: 'civil-engineering',
    art: 'civil',
    icon: FaDraftingCompass,
    title: 'Civil Engineering Services',
    tagline: 'Better planning. Stronger structures. Safer tomorrow.',
    summary:
      'Engineering consultancy, space planning, Pre-DCR regulatory support, material testing and cost estimation.',
    intro:
      'From the first layout to the final estimate, our civil engineering team helps you plan efficiently, meet Development Control Regulations and build with verified materials and realistic budgets.',
    items: [
      {
        title: 'Engineering Consultancy & Space Planning',
        points: [
          'Architectural layout blueprints',
          'Spatial interior planning',
          'Structural stability consulting',
        ],
      },
      {
        title: 'Pre-DCR & Regulatory Support',
        points: [
          'Technical drawing filtration',
          'Development Control Regulations alignment',
          'Plan-approval readiness',
        ],
      },
      {
        title: 'Testing, Estimation & Quality Control',
        points: [
          'On-site civil material testing',
          'Structural drawing upgradation',
          'Cost estimation and budgeting',
        ],
      },
    ],
  },
]

export const getService = (slug) => services.find((s) => s.slug === slug)
