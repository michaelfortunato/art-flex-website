import Store from '@components/Store/Store'
import Appbar from '@components/Appbar';
import styles from '@styles/IndexPage.module.css'
import { useInView } from 'react-intersection-observer';

export default function IndexPage() {
  return (
    <div className={styles.IndexPage}>
      <Appbar />
      <Store />
    </div>
  );
}
