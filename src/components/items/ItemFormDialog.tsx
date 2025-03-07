
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { PAYMENT_PURPOSES } from "@/lib/constants";

// Define the Item type
export interface Item {
  id: string;
  name: string;
  type: string;
  price: number;
  courseId?: string;
}

const itemFormSchema = z.object({
  name: z.string().min(3, {
    message: "Item name must be at least 3 characters",
  }),
  type: z.string({
    required_error: "Please select a type",
  }),
  price: z.coerce.number({
    required_error: "Price is required",
    invalid_type_error: "Price must be a number",
  }).positive("Price must be positive"),
  courseId: z.string().optional(),
});

type ItemFormValues = z.infer<typeof itemFormSchema>;

interface ItemFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (item: Partial<Item>) => void;
  item?: Item;
  courses: { id: string; code: string; name: string }[];
}

export function ItemFormDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  item,
  courses,
}: ItemFormDialogProps) {
  const isEditing = !!item;

  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: {
      name: item?.name || "",
      type: item?.type || PAYMENT_PURPOSES.BOOK,
      price: item?.price || 0,
      courseId: item?.courseId || undefined,
    },
  });

  const itemType = form.watch('type');
  const showCourseSelection = itemType === PAYMENT_PURPOSES.BOOK || itemType === PAYMENT_PURPOSES.HANDOUT;

  const handleSubmit = (values: ItemFormValues) => {
    onSubmit({
      id: item?.id,
      ...values,
    });
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Item" : "Add New Item"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Introduction to Programming Textbook" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select item type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={PAYMENT_PURPOSES.BOOK}>Book</SelectItem>
                      <SelectItem value={PAYMENT_PURPOSES.HANDOUT}>Handout</SelectItem>
                      <SelectItem value={PAYMENT_PURPOSES.TRIP}>Trip</SelectItem>
                      <SelectItem value={PAYMENT_PURPOSES.OTHER}>Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {showCourseSelection && (
              <FormField
                control={form.control}
                name="courseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Related Course</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select related course" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.code} - {course.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (GHS)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      placeholder="0.00" 
                      {...field} 
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? "Update Item" : "Add Item"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
