import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';

import CustomText from '../atoms/CustomText';

import fonts from '@/assets/fonts/fonts';
import { colors } from '@/assets/theme/AppTheme';
import { Routes } from '@/enums/screens';

type LoginRegisterLinkProps = {
  text: string;
  linkText: string;
  linkPath: Routes;
};

const LoginRegisterLink = ({ text, linkText, linkPath }: LoginRegisterLinkProps) => {
  return (
    <CustomText style={styles.memberText}>
      {`${text} `}
      <Link href={linkPath}>
        <CustomText style={[styles.memberText, { color: colors.yellow[100] }]}>
          {`${linkText} `}
        </CustomText>
      </Link>
    </CustomText>
  );
};

export default LoginRegisterLink;

const styles = StyleSheet.create({
  memberText: {
    fontSize: 11,
    fontFamily: fonts.primary.semiBold,
    color: colors.black,
    textAlign: 'center'
  }
});
