export default function CourseListing({
  _id,
  title,
  description,
  coursePicture,
  tags,
  completed,
  creator,
}: any) {
  return (
    <a href={`/courses/${_id}`}>
      <img src={coursePicture} alt={`${title} Course Image`} />
      <div>
        <h3>{title}</h3>
        <p>Created by {creator}</p>
        <p>Tags: {tags.join(", ")}</p>
        <p>{description}</p>
      </div>
      {(() => {
        if (!completed) {
          return null;
        }
        let c = false;
        for (let course of completed) {
          if (course._id === _id) {
            c = true;
            break;
          }
        }
        if (c) {
          return <p>✅ Completed!</p>;
        }
        return null;
      })()}
    </a>
  );
}
