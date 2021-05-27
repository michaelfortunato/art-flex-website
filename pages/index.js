import Store from '@components/Store/Store'
import Appbar from '@components/Appbar';
import styles from '@styles/IndexPage.module.css'

export default function IndexPage() {
  return (
    <div className={styles.IndexPage}>
          <Appbar />
          <Store />
      </div>
  );
}
