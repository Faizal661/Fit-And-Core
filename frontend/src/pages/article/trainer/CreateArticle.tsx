import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { articleSchema, ArticleFormData } from "../../../schemas/articleSchema";
import { MarkdownEditor } from "../../../components/article/MarkdownEditor";
import { createTrainerArticle } from "../../../services/article/articleService";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../context/ToastContext";
import Footer from "../../../components/shared/footer";
import { STATUS } from "../../../constants/messages/status.messages";
import { SUCCESS_MESSAGES } from "../../../constants/messages/success.messages";
import { WARNING_MESSAGES } from "../../../constants/messages/warning.messages";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Image, Tag, X, Plus } from "lucide-react";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const CreateArticle = () => {
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

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
    <div className="min-h-screen bg-gray-50 text-gray-800 overflow-hidden">
      {/* Hero Section */}
      <div className="relative py-24 bg-gradient-to-r from-blue-600/90 to-purple-600/90">
        <div className="absolute inset-0 bg-black/10 z-0 opacity-30"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        ></div>
        
        <motion.div 
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="relative z-10 max-w-6xl mx-auto px-6 text-center"
        >
          <motion.h1 variants={fadeIn} className="text-4xl md:text-5xl font-bold text-white mb-6">
            Create New Article
          </motion.h1>
          <motion.div variants={fadeIn} className="w-20 h-1 bg-white/30 mx-auto mb-6 rounded-full"></motion.div>
          <motion.p variants={fadeIn} className="text-white/80 max-w-2xl mx-auto">
            Share your knowledge and inspire others with your expertise
          </motion.p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 -mt-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-xl border border-gray-100 p-8 mb-16"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <motion.div variants={fadeIn} className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                {...register("title")}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter article title"
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </motion.div>

            <motion.div variants={fadeIn} className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Thumbnail Image</label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleThumbnailChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
                <Image className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
              {errors.thumbnail && (
                <p className="text-red-500 text-sm">{errors.thumbnail.message}</p>
              )}
              {thumbnailPreview && (
                <div className="mt-4">
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="w-full h-64 object-cover rounded-lg shadow-md"
                  />
                </div>
              )}
            </motion.div>

            <motion.div variants={fadeIn} className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Tags</label>
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Add tags..."
                  />
                  <Tag className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
                <motion.button
                  type="button"
                  onClick={addTag}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Plus size={18} />
                </motion.button>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map((tag) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </motion.span>
                ))}
              </div>
              {errors.tags && (
                <p className="text-red-500 text-sm">{errors.tags.message}</p>
              )}
            </motion.div>

            <motion.div variants={fadeIn} className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Content</label>
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
                <p className="text-red-500 text-sm">{errors.content.message}</p>
              )}
            </motion.div>

            <motion.div variants={fadeIn} className="pt-6">
              <motion.button
                type="submit"
                disabled={createArticleMutation.isPending}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-4 px-6 rounded-lg text-white font-medium transition-all duration-300 ${
                  createArticleMutation.isPending
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-blue-500/25"
                }`}
              >
                {createArticleMutation.isPending ? "Publishing..." : "Publish Article"}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default CreateArticle;