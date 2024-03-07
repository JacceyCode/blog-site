import { Link } from "react-router-dom";
import PostAuthor from "./PostAuthor";

const PostItem = ({
  postID,
  desc,
  category,
  title,
  thumbnail,
  authorID,
  createdAt,
}) => {
  const shortDesc = desc.length > 145 ? desc.substr(0, 100) + "..." : desc;
  const postTitle = title.length > 30 ? title.substr(0, 30) + "..." : title;

  return (
    <article className="post">
      <div className="post__thumbnail">
        <img
          src={`${import.meta.env.VITE_APP_ASSETS_URL}/uploads/${thumbnail}`}
          alt={title}
        />
      </div>
      <div className="post__content">
        <Link to={`/posts/${postID}`}>
          <h3>{postTitle}</h3>
        </Link>
        <p dangerouslySetInnerHTML={{ __html: shortDesc }} />

        <div className="post__footer">
          <PostAuthor authorID={authorID} createdAt={createdAt} />
          <Link className="btn category" to={`/posts/categories/${category}`}>
            {category}
          </Link>
        </div>
      </div>
    </article>
  );
};

export default PostItem;
