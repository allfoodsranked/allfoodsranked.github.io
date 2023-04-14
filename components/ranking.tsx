export const Ranking = ({
  rankings,
  header,
}: {
  rankings: { name: string | null }[];
  header: React.ReactNode;
}) => {
  return (
    <div className="my-4">
      <h2>{header}</h2>
      <ol>
        {rankings.slice(0, 10).map((v, index) => (
          <li key={v.name}>
            {index + 1}. {v.name}
          </li>
        ))}
      </ol>
    </div>
  );
};
