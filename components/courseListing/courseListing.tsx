export default function CourseListing({ id, name, description, image }) {
  return (
    <a href={`/courses/${id}`}>
      <img src={image} alt={`${name} Course Image`} />
      <div>
        <p>{name}</p>
        <p>{description}</p>
      </div>
    </a>
  );
}
