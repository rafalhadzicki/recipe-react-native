import { CheckBox, CheckBoxProps } from '@ui-kitten/components';

const CustomCheckBox = ({ style, ...props }: CheckBoxProps) => {
  return <CheckBox status="warning" style={style} {...props} />;
};

export default CustomCheckBox;
