/**
 * @param {Object} props
 * @param {React.ReactNode} [props.eyebrow]
 * @param {React.ReactNode} props.title
 * @param {React.ReactNode} [props.description]
 * @param {React.ReactNode} [props.action]
 * 
 */
export default function PageHeader({ eyebrow = null, title, description = null, action = null }) {
  return (
    <div className="flex flex-col gap-6 pb-7 pt-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && (
          <p className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
            <span className="h-px w-5 bg-accent" />
            {eyebrow}
          </p>
        )}
        <h1 className="display mt-4 text-[38px] leading-[0.95] text-balance sm:text-[50px]">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-[54ch] text-[13.5px] leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}