import { vars } from '../../themes.css';
import { stack } from '../utils/stack';
import { Label } from './Label';

export const Swatch = ({ name, value, fill }: { name: string; value: string; fill: string }) => {
  return (
    <div style={stack(vars.space[2])}>
      <div
        style={{
          background: fill,
          height: vars.space[16],
          borderRadius: vars.radius.md,
          // Without this, `surface` on `background` in the light theme is an
          // invisible swatch on an invisible card.
          border: `1px solid ${vars.color.border}`,
        }}
      />
      <Label name={name} value={value} />
    </div>
  );
};
