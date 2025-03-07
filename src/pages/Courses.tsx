
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus, PenSquare, Trash2, BookOpen, User, DollarSign } from 'lucide-react';
import { mockCourses, mockLecturers } from '@/data/mockData';
import { Course, Lecturer, Item } from '@/types';
import { LecturerFormDialog } from '@/components/lecturers/LecturerFormDialog';
import { ItemFormDialog } from '@/components/items/ItemFormDialog';

// Form schema for course management
const courseFormSchema = z.object({
  code: z.string().min(3, {
    message: "Course code must be at least 3 characters",
  }),
  name: z.string().min(3, {
    message: "Course name must be at least 3 characters",
  }),
  creditHours: z.coerce.number().min(1, {
    message: "Credit hours must be at least 1",
  }).max(10, {
    message: "Credit hours must be at most 10",
  }),
  venue: z.string().min(1, {
    message: "Venue is required",
  }),
  lecturerId: z.string({
    required_error: "Lecturer is required",
  }),
});

type CourseFormValues = z.infer<typeof courseFormSchema>;

export default function Courses() {
  const [activeTab, setActiveTab] = useState("courses");
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [lecturers, setLecturers] = useState<Lecturer[]>(mockLecturers);
  const [items, setItems] = useState<Item[]>([
    {
      id: "item-1",
      name: "Introduction to Programming Textbook",
      type: "book",
      price: 50,
      courseId: "course-1"
    },
    {
      id: "item-2",
      name: "Software Engineering Notes",
      type: "handout",
      price: 20,
      courseId: "course-2"
    }
  ]);
  
  // Course state
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [confirmDeleteCourse, setConfirmDeleteCourse] = useState<Course | null>(null);

  // Lecturer state
  const [isLecturerFormOpen, setIsLecturerFormOpen] = useState(false);
  const [selectedLecturer, setSelectedLecturer] = useState<Lecturer | null>(null);
  const [confirmDeleteLecturer, setConfirmDeleteLecturer] = useState<Lecturer | null>(null);

  // Item state
  const [isItemFormOpen, setIsItemFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [confirmDeleteItem, setConfirmDeleteItem] = useState<Item | null>(null);

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      code: "",
      name: "",
      creditHours: 3,
      venue: "",
      lecturerId: "",
    },
  });

  // Course handlers
  const handleAddCourse = () => {
    setSelectedCourse(null);
    form.reset({
      code: "",
      name: "",
      creditHours: 3,
      venue: "",
      lecturerId: "",
    });
    setIsAddingCourse(true);
  };

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    form.reset({
      code: course.code,
      name: course.name,
      creditHours: course.creditHours,
      venue: course.venue,
      lecturerId: course.lecturerId,
    });
    setIsEditingCourse(true);
  };

  const handleDeleteCourseConfirm = (course: Course) => {
    setConfirmDeleteCourse(course);
  };

  const handleDeleteCourse = () => {
    if (confirmDeleteCourse) {
      setCourses(courses.filter(course => course.id !== confirmDeleteCourse.id));
      setConfirmDeleteCourse(null);
      toast.success("Course deleted successfully");
    }
  };

  const onCourseSubmit = (values: CourseFormValues) => {
    if (isEditingCourse && selectedCourse) {
      setCourses(prevCourses => 
        prevCourses.map(course => 
          course.id === selectedCourse.id 
            ? { ...course, ...values } 
            : course
        )
      );
      setIsEditingCourse(false);
      toast.success("Course updated successfully");
    } else {
      const newCourse: Course = {
        id: `course-${Date.now()}`,
        code: values.code,
        name: values.name,
        creditHours: values.creditHours,
        venue: values.venue,
        lecturerId: values.lecturerId,
      };
      setCourses([...courses, newCourse]);
      setIsAddingCourse(false);
      toast.success("Course added successfully");
    }
    form.reset();
  };

  // Lecturer handlers
  const handleAddLecturer = () => {
    setSelectedLecturer(null);
    setIsLecturerFormOpen(true);
  };

  const handleEditLecturer = (lecturer: Lecturer) => {
    setSelectedLecturer(lecturer);
    setIsLecturerFormOpen(true);
  };

  const handleDeleteLecturerConfirm = (lecturer: Lecturer) => {
    setConfirmDeleteLecturer(lecturer);
  };

  const handleDeleteLecturer = () => {
    if (confirmDeleteLecturer) {
      setLecturers(lecturers.filter(lecturer => lecturer.id !== confirmDeleteLecturer.id));
      setConfirmDeleteLecturer(null);
      toast.success("Lecturer deleted successfully");
    }
  };

  const onLecturerSubmit = (data: Partial<Lecturer>) => {
    if (data.id) {
      // Update existing lecturer
      setLecturers(prevLecturers =>
        prevLecturers.map(lecturer =>
          lecturer.id === data.id ? { ...lecturer, ...data } : lecturer
        )
      );
      toast.success("Lecturer updated successfully");
    } else {
      // Add new lecturer
      const newLecturer: Lecturer = {
        id: `lecturer-${Date.now()}`,
        name: data.name || "",
        email: data.email || "",
        phone: data.phone,
      };
      setLecturers([...lecturers, newLecturer]);
      toast.success("Lecturer added successfully");
    }
    setIsLecturerFormOpen(false);
    setSelectedLecturer(null);
  };

  // Item handlers
  const handleAddItem = () => {
    setSelectedItem(null);
    setIsItemFormOpen(true);
  };

  const handleEditItem = (item: Item) => {
    setSelectedItem(item);
    setIsItemFormOpen(true);
  };

  const handleDeleteItemConfirm = (item: Item) => {
    setConfirmDeleteItem(item);
  };

  const handleDeleteItem = () => {
    if (confirmDeleteItem) {
      setItems(items.filter(item => item.id !== confirmDeleteItem.id));
      setConfirmDeleteItem(null);
      toast.success("Item deleted successfully");
    }
  };

  const onItemSubmit = (data: Partial<Item>) => {
    if (data.id) {
      // Update existing item
      setItems(prevItems =>
        prevItems.map(item =>
          item.id === data.id ? { ...item, ...data } : item
        )
      );
      toast.success("Item updated successfully");
    } else {
      // Add new item
      const newItem: Item = {
        id: `item-${Date.now()}`,
        name: data.name || "",
        type: data.type || "book",
        price: data.price || 0,
        courseId: data.courseId,
      };
      setItems([...items, newItem]);
      toast.success("Item added successfully");
    }
    setIsItemFormOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Academic Resources Management</h1>
      </div>

      <Tabs defaultValue="courses" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full sm:w-[400px]">
          <TabsTrigger value="courses" className="flex items-center">
            <BookOpen className="mr-2 h-4 w-4" />
            Courses
          </TabsTrigger>
          <TabsTrigger value="lecturers" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            Lecturers
          </TabsTrigger>
          <TabsTrigger value="items" className="flex items-center">
            <DollarSign className="mr-2 h-4 w-4" />
            Items
          </TabsTrigger>
        </TabsList>

        {/* Courses Tab */}
        <TabsContent value="courses">
          <div className="flex justify-end mb-4">
            <Button onClick={handleAddCourse}>
              <Plus className="mr-2 h-4 w-4" />
              Add Course
            </Button>
          </div>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Courses</CardTitle>
              <CardDescription>
                Manage courses, assign lecturers, and set venues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">Credit Hours</TableHead>
                      <TableHead className="hidden md:table-cell">Venue</TableHead>
                      <TableHead className="hidden lg:table-cell">Lecturer</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses.length > 0 ? (
                      courses.map((course) => {
                        const lecturer = lecturers.find(l => l.id === course.lecturerId);
                        return (
                          <TableRow key={course.id}>
                            <TableCell>{course.code}</TableCell>
                            <TableCell className="font-medium">{course.name}</TableCell>
                            <TableCell className="hidden md:table-cell">{course.creditHours}</TableCell>
                            <TableCell className="hidden md:table-cell">{course.venue}</TableCell>
                            <TableCell className="hidden lg:table-cell">{lecturer?.name}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEditCourse(course)}>
                                  <PenSquare className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteCourseConfirm(course)}>
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No courses found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Lecturers Tab */}
        <TabsContent value="lecturers">
          <div className="flex justify-end mb-4">
            <Button onClick={handleAddLecturer}>
              <Plus className="mr-2 h-4 w-4" />
              Add Lecturer
            </Button>
          </div>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Lecturers</CardTitle>
              <CardDescription>
                Manage lecturers and their contact information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">Email</TableHead>
                      <TableHead className="hidden lg:table-cell">Phone</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lecturers.length > 0 ? (
                      lecturers.map((lecturer) => (
                        <TableRow key={lecturer.id}>
                          <TableCell className="font-medium">{lecturer.name}</TableCell>
                          <TableCell className="hidden md:table-cell">{lecturer.email}</TableCell>
                          <TableCell className="hidden lg:table-cell">{lecturer.phone || "—"}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleEditLecturer(lecturer)}>
                                <PenSquare className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteLecturerConfirm(lecturer)}>
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          No lecturers found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Items Tab */}
        <TabsContent value="items">
          <div className="flex justify-end mb-4">
            <Button onClick={handleAddItem}>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Payment Items</CardTitle>
              <CardDescription>
                Manage books, handouts, trips, and other items students can pay for
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="hidden md:table-cell">Price (GHS)</TableHead>
                      <TableHead className="hidden lg:table-cell">Related Course</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.length > 0 ? (
                      items.map((item) => {
                        const relatedCourse = courses.find(c => c.id === item.courseId);
                        return (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>
                              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">{item.price.toFixed(2)}</TableCell>
                            <TableCell className="hidden lg:table-cell">
                              {relatedCourse ? `${relatedCourse.code} - ${relatedCourse.name}` : "—"}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEditItem(item)}>
                                  <PenSquare className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteItemConfirm(item)}>
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No items found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Course Dialog */}
      <Dialog open={isAddingCourse || isEditingCourse} onOpenChange={(open) => {
        if (!open) {
          setIsAddingCourse(false);
          setIsEditingCourse(false);
        }
      }}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {isEditingCourse ? "Edit Course" : "Add New Course"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onCourseSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Code</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. ITC123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="creditHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Credit Hours</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1" 
                          max="10" 
                          {...field} 
                          onChange={e => field.onChange(e.target.valueAsNumber)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Introduction to Programming" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="venue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Venue</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Room A1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lecturerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lecturer</FormLabel>
                    <div className="flex space-x-2">
                      <div className="flex-grow">
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a lecturer" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {lecturers.map((lecturer) => (
                              <SelectItem key={lecturer.id} value={lecturer.id}>
                                {lecturer.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setIsAddingCourse(false);
                          setIsEditingCourse(false);
                          handleAddLecturer();
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsAddingCourse(false);
                    setIsEditingCourse(false);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {isEditingCourse ? "Update Course" : "Add Course"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Lecturer Form Dialog */}
      <LecturerFormDialog
        isOpen={isLecturerFormOpen}
        onOpenChange={setIsLecturerFormOpen}
        onSubmit={onLecturerSubmit}
        lecturer={selectedLecturer || undefined}
      />

      {/* Item Form Dialog */}
      <ItemFormDialog
        isOpen={isItemFormOpen}
        onOpenChange={setIsItemFormOpen}
        onSubmit={onItemSubmit}
        item={selectedItem || undefined}
        courses={courses}
      />

      {/* Confirmation Dialogs */}
      <Dialog open={!!confirmDeleteCourse} onOpenChange={(open) => {
        if (!open) setConfirmDeleteCourse(null);
      }}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Confirm Course Deletion</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete the course "{confirmDeleteCourse?.name}"? 
            This action cannot be undone.
          </p>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setConfirmDeleteCourse(null)}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDeleteCourse}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!confirmDeleteLecturer} onOpenChange={(open) => {
        if (!open) setConfirmDeleteLecturer(null);
      }}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Confirm Lecturer Deletion</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete the lecturer "{confirmDeleteLecturer?.name}"? 
            This action cannot be undone.
          </p>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setConfirmDeleteLecturer(null)}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDeleteLecturer}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!confirmDeleteItem} onOpenChange={(open) => {
        if (!open) setConfirmDeleteItem(null);
      }}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Confirm Item Deletion</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete the item "{confirmDeleteItem?.name}"? 
            This action cannot be undone.
          </p>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setConfirmDeleteItem(null)}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDeleteItem}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
