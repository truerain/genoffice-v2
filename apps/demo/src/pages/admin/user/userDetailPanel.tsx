/**
 * @file apps/demo/src/pages/admin/user/userDetailPanel.tsx
 * @description User admin MasterDetail inline panel (horizontal sticky via CSS).
 * @created 2026-07-10
 *
 * @remark
 * - `.panel` sticky left; scrollport override는 `UserPage.module.css`.
 */

import type { UserRow } from './user.types';
import styles from './userDetailPanel.module.css';

type UserDetailPanelProps = {
  row: UserRow;
  onClose: () => void;
};

export function UserDetailPanel({ row, onClose }: UserDetailPanelProps) {
  return (
    <div className={styles.panel}>
      <div className={styles.titleRow}>
        <strong>{row.empName || row.loginId || row.userId || '사용자 상세'}</strong>
        <button type="button" className={styles.collapseButton} onClick={onClose}>
          닫기
        </button>
      </div>
      <div className={styles.formGrid}>
        <span className={styles.label}>사용자 ID</span>
        <span className={styles.value}>{row.userId || '-'}</span>
        <span className={styles.label}>Login ID</span>
        <span className={styles.value}>{row.loginId || '-'}</span>
        <span className={styles.label}>사번</span>
        <span className={styles.value}>{row.empNo || '-'}</span>
        <span className={styles.label}>사용자명</span>
        <span className={styles.value}>{row.empName || '-'}</span>
        <span className={styles.label}>영문명</span>
        <span className={styles.value}>{row.empNameEng || '-'}</span>
        <span className={styles.label}>Email</span>
        <span className={styles.value}>{row.email || '-'}</span>
        <span className={styles.label}>부서</span>
        <span className={styles.value}>{row.orgName || row.orgId || '-'}</span>
        <span className={styles.label}>직책</span>
        <span className={styles.value}>{row.titleName || row.titleCd || '-'}</span>
        <span className={styles.label}>사용 여부</span>
        <span className={styles.value}>{row.useYn === 'Y' ? '사용' : '미사용'}</span>
        <span className={styles.label}>최종수정시간</span>
        <span className={styles.value}>{row.lastUpdatedDate || '-'}</span>
        <span className={styles.label}>최종수정자</span>
        <span className={styles.value}>{row.lastUpdatedName || '-'}</span>
      </div>
    </div>
  );
}
