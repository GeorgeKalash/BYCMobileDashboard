import BlogDetails from "@/Components/Miscellaneous/Learning/LearningCourse/BlogDetails";
import { CommentTitleLearning, ImagePath } from "@/Constant";

const BlogSingle = () => {
const LearningCommentOne: string = "The best thing is location and drive through the forest. The resort is 35km from Ramnagar. The gardens are well kept and maintained. Its a good place for relaxation away from the city noise. The staff is very friendly and overall we had a really good & fun time, thanks to staff member - Bhairav, Rajat, Gunanand, Lokesh & everyone else. And also we went for an adventurous night safari and saw barking deers, tuskar elephant.";
const LearningCommentTwo: string = "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.";

  return (
    <div className="blog-single">
      <div className="blog-box blog-details">
        <BlogDetails />
      </div>
      <section className="comment-box">
        <h4>{CommentTitleLearning}</h4>
        <hr />
      </section>
    </div>
  );
};

export default BlogSingle;
