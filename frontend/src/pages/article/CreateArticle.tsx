import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { articleSchema, ArticleFormData } from "../../schemas/articleSchema";
import { MarkdownEditor } from "../../components/article/MarkdownEditor";
import { createTrainerArticle } from "../../services/article/articleService";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import Footer from "../../components/shared/Footer";
import { STATUS } from "../../constants/status.messges";
import { SUCCESS_MESSAGES } from "../../constants/success.messages";
import { WARNING_MESSAGES } from "../../constants/warning.messages";

const CreateArticle = () => {
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const navigate = useNavigate();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: [],
    },
  });

  const createArticleMutation = useMutation({
    mutationFn: createTrainerArticle,
    onSuccess: () => {
      showToast(STATUS.SUCCESS, SUCCESS_MESSAGES.ARTICLE_CREATED);
      navigate("/trainer/articles");
    },
    onError: () => {
      showToast(STATUS.ERROR, WARNING_MESSAGES.ARTICLE_CREATION_FAILED);
    },
  });

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setValue("thumbnail", file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      setValue("tags", newTags);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(newTags);
    setValue("tags", newTags);
  };

  const onSubmit = async (data: ArticleFormData) => {
    const articleObject = {
      title: data.title,
      content: data.content,
      thumbnail: data.thumbnail,
      tags: data.tags,
    };

    createArticleMutation.mutate(articleObject);
  };

  return (
    <div>
      <div className="min-h-screen bg-slate-600 flex  justify-center items-center">
        <div className="flex flex-col  md:min-w-2xl lg:min-w-4xl  pt-16 pb-12">
          <h1 className="text-3xl font-bold text-white mb-6 text-center ">
            Create New Article
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title field */}
            <div>
              <label htmlFor="title" className="block text-white mb-2">
                Title
              </label>
              <input
                id="title"
                {...register("title")}
                className="w-full p-3 border-1  text-white focus:outline-none"
                placeholder="Article title"
              />
              {errors.title && (
                <p className="text-red-500 mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="thumbnail" className="block text-white mb-2">
                Thumbnail Image
              </label>
              <input
                id="thumbnail"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleThumbnailChange}
                className="w-full p-3 border-1  text-white focus:outline-none"
              />
              {errors.thumbnail && (
                <p className="text-red-500 mt-1">{errors.thumbnail.message}</p>
              )}

              {thumbnailPreview && (
                <div className="mt-2">
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="h-32 md:h-44 lg:h-52 object-cover rounded"
                  />
                </div>
              )}
            </div>

            <div>
              <label htmlFor="tags" className="block text-white mb-2">
                Tags
              </label>
              <div className="flex">
                <input
                  id="tagInput"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTag())
                  }
                  className="flex-14 p-3 border-y-1 border-l-1 text-white focus:outline-none"
                  placeholder="Add a tag"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="flex-1 bg-black text-white px-4 border-y-1 border-r-1 border-white"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-white border-1 border-black px-3 py-1 flex items-center "
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-sm "
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              {errors.tags && (
                <p className="text-red-500 mt-1">{errors.tags.message}</p>
              )}
            </div>

            <div>
              <label className="block text-white mb-2">
                Content (Markdown)
              </label>
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <MarkdownEditor
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.content && (
                <p className="text-red-500 mt-1">{errors.content.message}</p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={createArticleMutation.isPending}
                className="text-white py-2 px-6 border-1 hover:bg-black hover:cursor-pointer disabled:opacity-50 "
              >
                {createArticleMutation.isPending
                  ? "Publishing..."
                  : "Publish Article"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CreateArticle;
