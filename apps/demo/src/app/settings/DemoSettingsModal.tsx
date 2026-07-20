/**
 * @file apps/demo/src/app/settings/DemoSettingsModal.tsx
 * @description Demo environment settings — frame layout and page chrome.
 * @created 2026-06-29
 * @updated 2026-07-20
 *
 * @remark
 * - Frame layout (titleBar / leftPanel) + PageLayout page header toggle
 * - Replaces header FrameLayoutToggle + logout
 *
 */

import type { FrameLayoutMode } from '@gen-office/gen-frame';
import { Button, Label, Radio, RadioGroup, StandardDialog, Switch } from '@gen-office/ui';
import { useI18n } from '../../i18n';
import styles from './DemoSettingsModal.module.css';

const LAYOUT_OPTIONS: FrameLayoutMode[] = ['titleBar', 'leftPanel'];

export interface DemoSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  layout: FrameLayoutMode;
  onLayoutChange: (layout: FrameLayoutMode) => void;
  showPageHeader: boolean;
  onShowPageHeaderChange: (show: boolean) => void;
}

export function DemoSettingsModal({
  open,
  onOpenChange,
  layout,
  onLayoutChange,
  showPageHeader,
  onShowPageHeaderChange,
}: DemoSettingsModalProps) {
  const { t } = useI18n();

  return (
    <StandardDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t('settings.title')}
      size="sm"
      initialHeight={420}
      bodyScrollable={false}
      footer={
        <Button type="button" size="sm" onClick={() => onOpenChange(false)}>
          {t('settings.close')}
        </Button>
      }
    >
      <div className={styles.body}>
        <p className={styles.sectionTitle}>{t('settings.layout.section')}</p>
        <RadioGroup
          className={styles.options}
          value={layout}
          onValueChange={(value) => onLayoutChange(value as FrameLayoutMode)}
        >
          {LAYOUT_OPTIONS.map((mode) => {
            const inputId = `demo-settings-layout-${mode}`;
            return (
              <div key={mode} className={styles.option}>
                <Radio value={mode} id={inputId} />
                <Label htmlFor={inputId} className={styles.optionLabel}>
                  <span className={styles.optionTitle}>{t(`settings.layout.${mode}.title`)}</span>
                  <span className={styles.optionHint}>{t(`settings.layout.${mode}.hint`)}</span>
                </Label>
              </div>
            );
          })}
        </RadioGroup>

        <p className={styles.sectionTitle}>{t('settings.pageChrome.section')}</p>
        <div className={styles.option}>
          <div className={styles.optionLabel}>
            <Label htmlFor="demo-settings-show-page-header" className={styles.optionTitle}>
              {t('settings.pageChrome.showHeader.title')}
            </Label>
            <span className={styles.optionHint}>
              {t('settings.pageChrome.showHeader.hint')}
            </span>
          </div>
          <Switch
            id="demo-settings-show-page-header"
            checked={showPageHeader}
            onCheckedChange={onShowPageHeaderChange}
            aria-label={t('settings.pageChrome.showHeader.title')}
          />
        </div>
      </div>
    </StandardDialog>
  );
}
