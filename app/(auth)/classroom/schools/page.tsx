"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building } from "lucide-react";
import { useEffect, useState } from "react";

// Algerian schools data
const mockSchools = [
  {
    id: "school-001",
    image: "/images/lycee-alger-logo.png",
    name: "ثانوية الأمير عبد القادر - الجزائر",
    status: "Active",
    location: "الجزائر العاصمة، الجزائر",
    verified: true,
    referral: {
      name: "د. عبد الكريم مدير المعهد",
      image: "/avatars/director.jpg",
    },
    value: 18.5,
    joinDate: "1962-07-05",
    schoolId: "SCH2025001",
    email: "info@lycee-alger.edu.dz",
    phone: "+213-21-234-567",
    website: "https://www.lycee-alger.edu.dz",
    address: "حي بن عكنون، شارع ديدوش مراد، الجزائر العاصمة",
    establishedYear: 1962,
    studentCount: 1850,
    teacherCount: 125,
    classCount: 65,
    type: "عمومي",
  },
  {
    id: "school-002",
    image: "/images/lycee-batna-logo.png",
    name: "ثانوية الشهيد مصطفى بن بولعيد - باتنة",
    status: "Active",
    location: "باتنة، الجزائر",
    verified: true,
    referral: {
      name: "د. فاطمة الزهراء بوعلام",
      image: "/avatars/teacher-physics.jpg",
    },
    value: 17.8,
    joinDate: "1970-09-15",
    schoolId: "SCH2025002",
    email: "info@lycee-batna.edu.dz",
    phone: "+213-33-345-678",
    website: "https://www.lycee-batna.edu.dz",
    address: "حي النصر، شارع الاستقلال، باتنة",
    establishedYear: 1970,
    studentCount: 1650,
    teacherCount: 110,
    classCount: 58,
    type: "عمومي",
  },
  {
    id: "school-003",
    image: "/images/lycee-constantine-logo.png",
    name: "ثانوية ابن خلدون - قسنطينة",
    status: "Active",
    location: "قسنطينة، الجزائر",
    verified: true,
    referral: {
      name: "أ. عبد الكريم مرزوق",
      image: "/avatars/teacher-arabic.jpg",
    },
    value: 18.2,
    joinDate: "1965-10-01",
    schoolId: "SCH2025003",
    email: "info@lycee-constantine.edu.dz",
    phone: "+213-31-456-789",
    website: "https://www.lycee-constantine.edu.dz",
    address: "حي بودراع صالح، شارع العربي بن مهيدي، قسنطينة",
    establishedYear: 1965,
    studentCount: 1750,
    teacherCount: 118,
    classCount: 62,
    type: "عمومي",
  },
  {
    id: "school-004",
    image: "/images/univ-oran-logo.png",
    name: "معهد التكنولوجيا العالي - وهران",
    status: "Active",
    location: "وهران، الجزائر",
    verified: true,
    referral: {
      name: "م. ياسين بن صالح التلمساني",
      image: "/avatars/teacher-cs.jpg",
    },
    value: 17.5,
    joinDate: "1975-11-20",
    schoolId: "SCH2025004",
    email: "info@univ-oran.edu.dz",
    phone: "+213-41-567-890",
    website: "https://www.univ-oran.edu.dz",
    address: "حي السانيا، طريق السانيا، وهران",
    establishedYear: 1975,
    studentCount: 2500,
    teacherCount: 180,
    classCount: 85,
    type: "جامعي",
  },
  {
    id: "school-005",
    image: "/images/institut-ghardaia-logo.png",
    name: "معهد العلوم الإسلامية - غرداية",
    status: "Active",
    location: "غرداية، الجزائر",
    verified: true,
    referral: {
      name: "الشيخ أحمد بن محمد الغرداوي",
      image: "/avatars/teacher-islamic.jpg",
    },
    value: 19.0,
    joinDate: "1980-03-12",
    schoolId: "SCH2025005",
    email: "info@institut-ghardaia.edu.dz",
    phone: "+213-29-678-901",
    website: "https://www.institut-ghardaia.edu.dz",
    address: "حي بني يزقن، شارع الأمير عبد القادر، غرداية",
    establishedYear: 1980,
    studentCount: 850,
    teacherCount: 65,
    classCount: 35,
    type: "ديني",
  },
  {
    id: "school-006",
    image: "/images/lycee-chlef-logo.png",
    name: "ثانوية الشهيدة حسيبة بن بوعلي - الشلف",
    status: "Active",
    location: "الشلف، الجزائر",
    verified: true,
    referral: {
      name: "د. سعاد بن عيسى",
      image: "/avatars/teacher-biology.jpg",
    },
    value: 17.2,
    joinDate: "1968-05-08",
    schoolId: "SCH2025006",
    email: "info@lycee-chlef.edu.dz",
    phone: "+213-27-789-012",
    website: "https://www.lycee-chlef.edu.dz",
    address: "حي النصر، شارع الشهداء، الشلف",
    establishedYear: 1968,
    studentCount: 1450,
    teacherCount: 95,
    classCount: 52,
    type: "عمومي",
  },
  {
    id: "school-007",
    image: "/images/lycee-setif-logo.png",
    name: "ثانوية الأمير عبد القادر - سطيف",
    status: "Active",
    location: "سطيف، الجزائر",
    verified: true,
    referral: {
      name: "أ. نور الدين بلعباس",
      image: "/avatars/teacher-history.jpg",
    },
    value: 16.8,
    joinDate: "1972-09-20",
    schoolId: "SCH2025007",
    email: "info@lycee-setif.edu.dz",
    phone: "+213-36-890-123",
    website: "https://www.lycee-setif.edu.dz",
    address: "حي الحيات، شارع 8 ماي 1945، سطيف",
    establishedYear: 1972,
    studentCount: 1600,
    teacherCount: 105,
    classCount: 56,
    type: "عمومي",
  },
  {
    id: "school-008",
    image: "/images/lycee-annaba-logo.png",
    name: "ثانوية الشهيد العربي بن مهيدي - عنابة",
    status: "Active",
    location: "عنابة، الجزائر",
    verified: true,
    referral: {
      name: "أ. خديجة بن عمر",
      image: "/avatars/teacher-french.jpg",
    },
    value: 16.5,
    joinDate: "1969-04-15",
    schoolId: "SCH2025008",
    email: "info@lycee-annaba.edu.dz",
    phone: "+213-38-901-234",
    website: "https://www.lycee-annaba.edu.dz",
    address: "حي سيدي عمار، شارع الثورة، عنابة",
    establishedYear: 1969,
    studentCount: 1550,
    teacherCount: 100,
    classCount: 54,
    type: "عمومي",
  },
  {
    id: "school-009",
    image: "/images/univ-tlemcen-logo.png",
    name: "جامعة أبو بكر بلقايد - تلمسان",
    status: "Active",
    location: "تلمسان، الجزائر",
    verified: true,
    referral: {
      name: "د. عمر بن الطاهر",
      image: "/avatars/teacher-engineering.jpg",
    },
    value: 17.8,
    joinDate: "1974-12-03",
    schoolId: "SCH2025009",
    email: "info@univ-tlemcen.edu.dz",
    phone: "+213-43-012-345",
    website: "https://www.univ-tlemcen.edu.dz",
    address: "حي الإمام، الحرم الجامعي، تلمسان",
    establishedYear: 1974,
    studentCount: 3200,
    teacherCount: 220,
    classCount: 95,
    type: "جامعي",
  },
  {
    id: "school-010",
    image: "/images/lycee-blida-logo.png",
    name: "ثانوية الشهيدة جميلة بوحيرد - البليدة",
    status: "Inactive",
    location: "البليدة، الجزائر",
    verified: false,
    referral: {
      name: "أ. زينب بوشامة",
      image: "/avatars/teacher-english.jpg",
    },
    value: 15.5,
    joinDate: "1978-06-25",
    schoolId: "SCH2025010",
    email: "info@lycee-blida.edu.dz",
    phone: "+213-25-123-456",
    website: "https://www.lycee-blida.edu.dz",
    address: "حي الكرامة، شارع الاستقلال، البليدة",
    establishedYear: 1978,
    studentCount: 950,
    teacherCount: 68,
    classCount: 42,
    type: "عمومي",
  },
];

// Custom columns for schools
const getSchoolColumns = () => [
  {
    id: "select",
    header: "Select",
  },
  {
    header: "Name",
    accessorKey: "name",
  },
  {
    header: "ID",
    accessorKey: "schoolId",
  },
  {
    header: "Status",
    accessorKey: "status",
  },
  {
    header: "Type",
    accessorKey: "type",
  },
  {
    header: "Students",
    accessorKey: "studentCount",
  },
  {
    header: "Teachers",
    accessorKey: "teacherCount",
  },
  {
    header: "Classes",
    accessorKey: "classCount",
  },
  {
    header: "Established",
    accessorKey: "establishedYear",
  },
  {
    id: "actions",
    header: "Actions",
  },
];

export default function SchoolsPage() {
  const [schools, setSchools] = useState<typeof mockSchools>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchSchools = async () => {
      try {
        // In a real app, you would fetch data from an API
        // const response = await fetch('/api/schools');
        // const data = await response.json();
        // setSchools(data);

        // For now, we'll just use the mock data
        setSchools(mockSchools);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching schools data:", error);
        setLoading(false);
      }
    };

    fetchSchools();
  }, []);

  // Import the DataView component dynamically to avoid SSR issues with window
  const DataView = dynamic(
    () => import("@/components/classroom/contacts-table"),
    {
      ssr: false,
      loading: () => <p>Loading table...</p>,
    },
  );

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Schools</h1>
        <Button>
          <Building className="mr-2 h-4 w-4" />
          Add School
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">جميع المؤسسات</TabsTrigger>
          <TabsTrigger value="active">نشط</TabsTrigger>
          <TabsTrigger value="inactive">غير نشط</TabsTrigger>
          <TabsTrigger value="public">عمومي</TabsTrigger>
          <TabsTrigger value="university">جامعي</TabsTrigger>
          <TabsTrigger value="religious">ديني</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>All Schools</CardTitle>
              <CardDescription>
                Manage all schools in the system. Click on a school to view its
                profile.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Loading schools...</p>
                </div>
              ) : (
                <DataView
                  initialData={schools}
                  columns={getSchoolColumns()}
                  onRowClick={(school) => {
                    window.location.href = `/classroom/schools/${school.id}`;
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Schools</CardTitle>
              <CardDescription>
                View and manage currently active schools.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Loading schools...</p>
                </div>
              ) : (
                <DataView
                  initialData={schools.filter(
                    (school) => school.status === "Active",
                  )}
                  columns={getSchoolColumns()}
                  onRowClick={(school) => {
                    window.location.href = `/classroom/schools/${school.id}`;
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inactive" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Inactive Schools</CardTitle>
              <CardDescription>
                View and manage inactive schools.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Loading schools...</p>
                </div>
              ) : (
                <DataView
                  initialData={schools.filter(
                    (school) => school.status === "Inactive",
                  )}
                  columns={getSchoolColumns()}
                  onRowClick={(school) => {
                    window.location.href = `/classroom/schools/${school.id}`;
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="public" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>المؤسسات العمومية</CardTitle>
              <CardDescription>عرض وإدارة المؤسسات التعليمية العمومية.</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Loading schools...</p>
                </div>
              ) : (
                <DataView
                  initialData={schools.filter(
                    (school) => school.type === "عمومي",
                  )}
                  columns={getSchoolColumns()}
                  onRowClick={(school) => {
                    window.location.href = `/classroom/schools/${school.id}`;
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="university" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>المؤسسات الجامعية</CardTitle>
              <CardDescription>
                عرض وإدارة الجامعات والمعاهد العليا.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Loading schools...</p>
                </div>
              ) : (
                <DataView
                  initialData={schools.filter(
                    (school) => school.type === "جامعي",
                  )}
                  columns={getSchoolColumns()}
                  onRowClick={(school) => {
                    window.location.href = `/classroom/schools/${school.id}`;
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="religious" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>المؤسسات الدينية</CardTitle>
              <CardDescription>
                عرض وإدارة معاهد العلوم الإسلامية والمؤسسات الدينية.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Loading schools...</p>
                </div>
              ) : (
                <DataView
                  initialData={schools.filter(
                    (school) => school.type === "ديني",
                  )}
                  columns={getSchoolColumns()}
                  onRowClick={(school) => {
                    window.location.href = `/classroom/schools/${school.id}`;
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Import dynamic at the end to avoid hoisting issues
import dynamic from "next/dynamic";
