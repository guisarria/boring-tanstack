import { Edit, X } from "lucide-react"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/modules/auth/auth-client"
import { Image } from "@unpic/react"
import type { User } from "@/modules/auth/schema"
import  { Spinner } from "@/components/ui/spinner"

function convertImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function EditUserDialog({ user }: { user: User }) {
  const [name, setName] = useState<string>()
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }
  const [open, setOpen] = useState<boolean>(false)
  const [isLoading, startTransition] = useTransition()
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger
        render={
          <Button className="w-full gap-2 px-4" size="sm" variant="outline">
            <Edit size={13} />
            Edit user
          </Button>
        }
      />
      <DialogContent className="w-11/12 sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Edit user information</DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setName(e.target.value)
            }}
            placeholder={user.name}
            required
            type="name"
          />
          <div className="mt-2 grid gap-2">
            <Label htmlFor="image">Profile Image</Label>
            <div className="relative flex items-end">
              {imagePreview ? (
                <div className="relative mt-2 mr-4 h-16 w-16 overflow-hidden rounded-sm">
                  <Image
                    alt="Profile preview"
                    layout="fullWidth"
                    objectFit="cover"
                    src={imagePreview}
                  />
                </div>
              ) : null}
              <div className="flex w-full items-center gap-2">
                <label htmlFor="image">
                  <Button className="relative w-full" type="button">
                    <Input
                      accept="image/*"
                      className="absolute opacity-0"
                      id="image"
                      onChange={handleImageChange}
                      type="file"
                    />
                    Upload
                  </Button>
                </label>

                {imagePreview ? (
                  <X
                    className="absolute top-0 -left-2 cursor-pointer rounded-full bg-muted/50"
                    onClick={() => {
                      setImage(null)
                      setImagePreview(null)
                    }}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            disabled={isLoading}
            onClick={() => {
              startTransition(async () => {
                await authClient.updateUser({
                  image: image ? await convertImageToBase64(image) : undefined,
                  name: name ? name : undefined,
                  fetchOptions: {
                    onSuccess: () => {
                      toast.success("User updated successfully")
                    },
                    onError: (e) => {
                      toast.error(e.error.message)
                    },
                  },
                })
                startTransition(() => {
                  setName("")
                  setImage(null)
                  setImagePreview(null)
                  setOpen(false)
                })
              })
            }}
          >
            {isLoading ? <Spinner /> : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
