"use client";
import { useNotification } from "@/app/context/NotificationContext";
import { usePosts } from "@/app/context/PostsContext";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Newspaper, Pencil, Search, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
  comments?: any[];
};

export default function Component({ posts }: { posts: Post[] }) {
  const { addPost, editPost, fetchPost, selectedPost } = usePosts();
  const { showMessage } = useNotification();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<Post | null>(null);

  const [isOpenPost, setIsOpenPost] = useState(false);

  const postsPerPage = 8;
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.body.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleSave = async (post: Post) => {
    try {
      if (currentPost) {
        await editPost(post.id!, post);
        showMessage("Post actualizado exitosamente");
      } else {
        await addPost(post);
        showMessage("Post creado exitosamente");
      }
      setIsOpen(false);
      setCurrentPost(null);
    } catch (error) {
      console.error("Error al guardar el post:", error);
      showMessage(
        `Error al ${currentPost ? "actualizar" : "crear"} el post.`,
        "destructive"
      );
    }
  };

  const handleEdit = (post: Post) => {
    setCurrentPost(post);
    setIsOpen(true);
  };

  const handleViewPost = async (postId: number) => {
    await fetchPost(postId);
    setIsOpenPost(true);
  };

  const handleCloseDialog = () => {
    setIsOpenPost(false);
  };

  return (
    <div className="container mx-auto p-0">
      <div className="flex justify-between gap-3 items-center mb-4">
        <div className="flex items-center gap-2 border rounded-md border-gray-300 px-4 py-2 shadow-sm">
          <Search />
          <input
            className="h-full w-full border-none bg-transparent text-gray-700 focus:outline-none max-w-sm 
          "
            placeholder="Buscar posts..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setCurrentPost(null)}>
              Crear Post
              <Newspaper className="ml-3 h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {currentPost ? "Editar Post" : "Crear Nuevo Post"}
              </DialogTitle>
            </DialogHeader>
            <PostForm post={currentPost} onSave={handleSave} />
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader className="text-left bg-gray-100 font-semibold text-lg">
          <TableRow className="">
            <TableHead className="w-1/5 sm:w-1/4 md:w-1/5 lg:w-2/6 text-slate-800">
              Título
            </TableHead>
            <TableHead className="w-1/3 sm:w-1/2 md:w-1/3 lg:w-3/6 text-slate-800">
              Contenido
            </TableHead>
            <TableHead className="w-1/5 sm:w-1/4 md:w-1/5 lg:w-1/6 text-slate-800">
              Acciones
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentPosts.map((post) => (
            <TableRow
              key={post.id}
              className="animate__animated animate__fadeIn"
            >
              <TableCell className="w-full sm:w-auto">
                <span
                  onClick={() => handleViewPost(post.id)}
                  className="cursor-pointer line-clamp-1 text-sm sm:text-base hover:underline font-semibold"
                >
                  {post.title}
                </span>
              </TableCell>
              <TableCell>
                <p className="line-clamp-2">{post.body}</p>
              </TableCell>
              <TableCell className="flex">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(post)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Editar Post</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <DeleteConfirmation id={post.id!} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-center mt-4 text-sm">
        {currentPosts.length === 0 ? (
          <p className="text-lg mt-6 text-center text-slate-800">
            No hay posts disponibles
          </p>
        ) : (
          <p>
            Mostrando {(currentPage - 1) * postsPerPage + 1} a{" "}
            {Math.min(currentPage * postsPerPage, filteredPosts.length)} de{" "}
            {filteredPosts.length} posts
          </p>
        )}
      </div>
      <div className="flex justify-center mt-4">
        {Array.from(
          { length: Math.ceil(filteredPosts.length / postsPerPage) },
          (_, i) => (
            <Button
              key={i}
              onClick={() => paginate(i + 1)}
              variant={currentPage === i + 1 ? "default" : "outline"}
              className="mx-1"
            >
              {i + 1}
            </Button>
          )
        )}
      </div>
      {isOpenPost && selectedPost && (
        <Dialog open={isOpenPost} onOpenChange={setIsOpenPost}>
          <DialogContent className="md:min-w-[700px]">
            <DialogHeader>
              <DialogTitle>{selectedPost.title}</DialogTitle>
            </DialogHeader>
            <div className="mt-2">
              <p>{selectedPost.body}</p>
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold mt-4">Comentarios</h2>
              <ScrollArea className="max-h-60">
                <ul className="list-disc list-inside">
                  {selectedPost.comments?.map((comment: any) => (
                    <li key={comment.id} className="mt-2 flex flex-col">
                      <p className="font-semibold">{comment.email}</p>
                      <p className="text-sm line-clamp-2">{comment.body}</p>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </div>
            <DialogFooter>
              <Button onClick={handleCloseDialog}>Cerrar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function PostForm({
  post,
  onSave,
}: {
  post: Post | null;
  onSave: (post: Post) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Post>({
    defaultValues: post || { title: "", body: "" },
  });
  const { showMessage } = useNotification();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: Post) => {
    try {
      await onSave({ ...data, id: post?.id || 0 });
    } catch (error) {
      showMessage("Error al guardar el post.", "destructive");
    }
    setIsLoading(false);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setIsLoading(true);
        handleSubmit(onSubmit)(e);
      }}
      className="space-y-4"
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          {...register("title", { required: "El título es requerido" })}
          placeholder="Ingrese el título del post"
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="body">Contenido</Label>
        <Textarea
          id="body"
          {...register("body", { required: "El contenido es requerido" })}
          placeholder="Ingrese el contenido del post"
          className="w-full h-60 max-h-96"
        />
        {errors.body && (
          <p className="text-sm text-red-500">{errors.body.message}</p>
        )}
      </div>
      <div className="flex justify-end">
        <Button disabled={isLoading} type="submit">
          Guardar
        </Button>
      </div>
    </form>
  );
}

const DeleteConfirmation = ({ id }: { id: number }) => {
  const { removePost } = usePosts();
  const { showMessage } = useNotification();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await removePost(id);
      showMessage("Post eliminado exitosamente");
    } catch (error) {
      console.error("Error al eliminar el post:", error);
      showMessage("Error al eliminar el post.");
    } finally {
      setOpen(false);
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger className="">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:text-red-400 text-sm outline-none"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Eliminar Post</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-xs">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">
            ¿Desea eliminar el post?
          </AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro de que deseas eliminar el post?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-center">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button disabled={isLoading} onClick={handleDelete}>
            Continuar
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
