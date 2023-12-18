export default function CourseListing({
  _id,
  title,
  description,
  coursePicture,
  tags,
}) {
  return (
    <a href={`/courses/${_id}`}>
      <img src={coursePicture} alt={`${title} Course Image`} />
      <div>
        <h3>{title}</h3>
        <p>Tags: {tags.join(", ")}</p>
        <p>{description}</p>
      </div>
    </a>
  );
}
