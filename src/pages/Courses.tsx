
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus, PenSquare, Trash2, BookOpen } from 'lucide-react';
import { mockCourses, mockLecturers } from '@/data/mockData';
import { Course } from '@/types';

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
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Course | null>(null);

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

  const handleDeleteConfirm = (course: Course) => {
    setConfirmDelete(course);
  };

  const handleDelete = () => {
    if (confirmDelete) {
      setCourses(courses.filter(course => course.id !== confirmDelete.id));
      setConfirmDelete(null);
      toast.success("Course deleted successfully");
    }
  };

  const onSubmit = (values: CourseFormValues) => {
    if (isEditingCourse && selectedCourse) {
      // Update existing course
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
      // Add new course
      const newCourse: Course = {
        id: `course-${Date.now()}`,
        ...values,
      };
      setCourses([...courses, newCourse]);
      setIsAddingCourse(false);
      toast.success("Course added successfully");
    }
    form.reset();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Course Management</h1>
        <Button onClick={handleAddCourse}>
          <Plus className="mr-2 h-4 w-4" />
          Add Course
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Courses</CardTitle>
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
                    const lecturer = mockLecturers.find(l => l.id === course.lecturerId);
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
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteConfirm(course)}>
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

      {/* Add/Edit Course Dialog */}
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        {mockLecturers.map((lecturer) => (
                          <SelectItem key={lecturer.id} value={lecturer.id}>
                            {lecturer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!confirmDelete} onOpenChange={(open) => {
        if (!open) setConfirmDelete(null);
      }}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete the course "{confirmDelete?.name}"? 
            This action cannot be undone.
          </p>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setConfirmDelete(null)}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
