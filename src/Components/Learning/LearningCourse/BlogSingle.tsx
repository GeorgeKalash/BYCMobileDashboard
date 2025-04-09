import BlogDetails from "@/Components/Miscellaneous/Learning/LearningCourse/BlogDetails";

const BlogSingle = () => {

  return (
    <div className="blog-single">
      <div className="blog-box blog-details">
        <BlogDetails />
      </div>
      <section className="comment-box">
        <h4>'CommentTitleLearning'</h4>
        <hr />
      </section>
    </div>
  );
};

export default BlogSingle;
