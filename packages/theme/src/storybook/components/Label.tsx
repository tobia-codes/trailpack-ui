import { vars } from '../../themes.css';
import { stack } from '../utils/stack';

export const Label = ({ name, value }: { name: string; value?: string }) => {
  return (
    <div style={stack(vars.space[1])}>
      <span style={{ fontFamily: vars.font.family.mono, fontSize: vars.font.size.xs }}>{name}</span>
      {value !== undefined && (
        <span
          style={{
            fontFamily: vars.font.family.mono,
            fontSize: vars.font.size.xs,
            color: vars.color.mutedForeground,
          }}
        >
          {value}
        </span>
      )}
    </div>
  );
};
