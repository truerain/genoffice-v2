/**
 * @file packages/ui/src/composed/modalInput/ModalInput.tsx
 * @description Search modal lookup picker on core Input + Dialog (single/multi).
 * @created 2026-06-25
 * @updated 2026-07-12
 *
 * @remark
 * - Exports: ModalInput
 * - Local filter or fetchItems remote search; draft → confirm/cancel
 * - data-gen-grid-editor-overlay + data-gen-datagrid-editor-surface on DialogContent
 * - hideTrigger: dialog-only mode for GenDataGrid editLookup.renderModal
 * - multi selectedTooltip 'auto': full labels when 2+ selected (hidden while modal open)
 */
import { useEffect, useMemo, useRef, useState, type Ref } from 'react';
import { Search, X } from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from '../../core/button';
import { Input } from '../../core/input';
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../core/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../core/tooltip';
import type {
  ModalInputListColumn,
  ModalInputProps,
  ModalInputSelectedTooltip,
  ModalInputSelection,
  MultiModalInputProps,
} from './ModalInput.types';
import styles from './ModalInput.module.css';

function assignRef<T>(ref: Ref<T> | undefined, value: T) {
  if (!ref) return;
  if (typeof ref === 'function') {
    ref(value);
    return;
  }
  (ref as { current: T }).current = value;
}
function localFilter<TData>(list: ModalInputSelection<TData>[], keyword: string) {
  const normalized = keyword.trim().toLowerCase();
  if (!normalized) return list;
  return list.filter((item) => {
    const haystack = [item.label, item.value, item.description ?? '', ...(item.keywords ?? [])]
      .join(' ')
      .toLowerCase();
    return haystack.includes(normalized);
  });
}

function defaultDisplayValue<TData>(
  selectedItems: ModalInputSelection<TData>[],
  mode: 'single' | 'multi'
) {
  if (selectedItems.length === 0) return '';
  if (mode === 'single') return selectedItems[0]?.label ?? '';
  if (selectedItems.length === 1) return selectedItems[0]?.label ?? '';
  const first = selectedItems[0]?.label ?? '';
  return `${first} +${selectedItems.length - 1}`;
}

function defaultSelectedTooltipContent<TData>(selectedItems: ModalInputSelection<TData>[]) {
  return selectedItems.map((item) => item.label).join(', ');
}

function resolveSelectedTooltipVisible(
  mode: ModalInputSelectedTooltip | undefined,
  selectedCount: number
) {
  if (mode === false) return false;
  if (mode === true) return selectedCount > 0;
  return selectedCount > 1;
}

export function ModalInput<TData = unknown>(props: ModalInputProps<TData>) {
  const {
    mode,
    items = [],
    fetchItems,
    searchOnInputChange = false,
    title = 'Select item',
    modalDescription,
    placeholder,
    searchPlaceholder = 'Search...',
    clearSearchOnOpen = false,
    disabled,
    readOnly = true,
    openOnInputFocus = false,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    hideTrigger = false,
    defaultSearchValue = '',
    commitOnItemClick = false,
    draggable = true,
    dialogContentRef,
    triggerAriaLabel = 'Open search modal',
    triggerIcon,
    label,
    helperText,
    error,
    required,
    fullWidth,
    clearable = true,
    clearLabel = 'Clear',
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    emptyMessage = 'No results found.',
    loadingMessage = 'Loading...',
    confirmOnDoubleClick = true,
    autoFocusSearch = true,
    modalWidth,
    modalHeight,
    listColumns,
    className,
    inputClassName,
    dialogClassName,
    listClassName,
    formatDisplayValue,
  } = props;

  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [internalSelectedItems, setInternalSelectedItems] = useState<
    ModalInputSelection<TData>[]
  >([]);
  const [searchValue, setSearchValue] = useState(defaultSearchValue);
  const [inputValue, setInputValue] = useState('');
  const [draftSelectedItems, setDraftSelectedItems] = useState<ModalInputSelection<TData>[]>([]);
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const [remoteItems, setRemoteItems] = useState<ModalInputSelection<TData>[]>([]);
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState<{ left: number; top: number } | null>(null);
  const requestSeqRef = useRef(0);
  const skipNextFocusOpenRef = useRef(false);
  const dragStateRef = useRef<{ pointerId: number; offsetX: number; offsetY: number } | null>(
    null
  );
  const contentRef = useRef<HTMLDivElement | null>(null);

  const setDialogContentNode = (node: HTMLDivElement | null) => {
    contentRef.current = node;
    assignRef(dialogContentRef, node);
  };
  const open = openProp ?? internalOpen;
  const singleSelectedItem =
    mode === 'single' ? (props as { selectedItem?: ModalInputSelection<TData> | null }).selectedItem : undefined;
  const multiSelectedItems =
    mode === 'multi' ? (props as { selectedItems?: ModalInputSelection<TData>[] }).selectedItems : undefined;
  const controlledSelectedItems = useMemo(() => {
    if (mode === 'single') {
      if (singleSelectedItem === undefined) return undefined;
      return singleSelectedItem ? [singleSelectedItem] : [];
    }
    return multiSelectedItems;
  }, [mode, multiSelectedItems, singleSelectedItem]);
  const resolvedSelectedItems = controlledSelectedItems ?? internalSelectedItems;
  const resolvedDisplayValue =
    formatDisplayValue?.(resolvedSelectedItems, mode) ??
    defaultDisplayValue(resolvedSelectedItems, mode);
  const multiProps = mode === 'multi' ? (props as MultiModalInputProps<TData>) : null;
  const selectedTooltip = multiProps?.selectedTooltip ?? 'auto';
  const formatSelectedTooltip = multiProps?.formatSelectedTooltip;
  const showSelectedTooltip =
    mode === 'multi' &&
    resolveSelectedTooltipVisible(selectedTooltip, resolvedSelectedItems.length);
  const selectedTooltipContent =
    formatSelectedTooltip?.(resolvedSelectedItems) ??
    defaultSelectedTooltipContent(resolvedSelectedItems);
  const inputAriaLabel =
    mode === 'multi' && !label && resolvedSelectedItems.length > 1
      ? defaultSelectedTooltipContent(resolvedSelectedItems)
      : undefined;

  const setOpen = (nextOpen: boolean) => {
    if (openProp === undefined) setInternalOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  useEffect(() => {
    if (readOnly) return;
    if (open) return;
    setInputValue(resolvedDisplayValue);
  }, [open, readOnly, resolvedDisplayValue]);

  useEffect(() => {
    if (!open) return;
    setDraftSelectedItems(resolvedSelectedItems);
    setShowSelectedOnly(false);
    if (clearSearchOnOpen) {
      setSearchValue('');
      return;
    }
    const keyword = defaultSearchValue.trim();
    if (keyword) {
      setSearchValue(keyword);
      return;
    }
    if (mode === 'multi' || hideTrigger) {
      setSearchValue('');
      return;
    }
    const seed = readOnly ? resolvedDisplayValue : inputValue;
    setSearchValue(seed.trim());
  }, [
    clearSearchOnOpen,
    defaultSearchValue,
    hideTrigger,
    inputValue,
    mode,
    open,
    readOnly,
    resolvedDisplayValue,
    resolvedSelectedItems,
  ]);

  useEffect(() => {
    if (!open || !fetchItems) return;
    const requestId = ++requestSeqRef.current;
    setLoading(true);
    fetchItems(searchValue.trim())
      .then((nextItems) => {
        if (requestSeqRef.current !== requestId) return;
        setRemoteItems(Array.isArray(nextItems) ? nextItems : []);
      })
      .finally(() => {
        if (requestSeqRef.current === requestId) {
          setLoading(false);
        }
      });
  }, [fetchItems, open, searchValue]);

  useEffect(() => {
    if (open) return;
    setPosition(null);
    dragStateRef.current = null;
  }, [open]);

  const sourceItems = fetchItems ? remoteItems : items;
  const filteredItems = useMemo(
    () => (fetchItems ? sourceItems : localFilter(sourceItems, searchValue)),
    [fetchItems, searchValue, sourceItems]
  );
  const draftSelectedKeySet = useMemo(
    () => new Set(draftSelectedItems.map((item) => item.value)),
    [draftSelectedItems]
  );
  const visibleItems = useMemo(() => {
    if (mode !== 'multi' || !showSelectedOnly) return filteredItems;
    return filteredItems.filter((item) => draftSelectedKeySet.has(item.value));
  }, [draftSelectedKeySet, filteredItems, mode, showSelectedOnly]);

  const applySelection = (nextItems: ModalInputSelection<TData>[]) => {
    if (controlledSelectedItems === undefined) {
      setInternalSelectedItems(nextItems);
    }

    if (mode === 'single') {
      const nextItem = nextItems[0] ?? null;
      props.onSelectedItemChange?.(nextItem);
      return;
    }

    props.onSelectedItemsChange?.(nextItems);
  };

  const commitSelection = (nextItems: ModalInputSelection<TData>[]) => {
    applySelection(nextItems);
    if (mode === 'single') {
      props.onCommit?.(nextItems[0] ?? null);
    } else {
      props.onCommit?.(nextItems);
    }
    setOpen(false);
  };

  const clearSelection = () => {
    skipNextFocusOpenRef.current = true;
    commitSelection([]);
    if (!readOnly) {
      setInputValue('');
    }
  };

  const toggleDraftSelection = (item: ModalInputSelection<TData>) => {
    if (item.disabled) return;

    if (mode === 'single') {
      setDraftSelectedItems([item]);
      return;
    }

    setDraftSelectedItems((prev) => {
      if (prev.some((selected) => selected.value === item.value)) {
        return prev.filter((selected) => selected.value !== item.value);
      }
      return [...prev, item];
    });
  };

  const handleItemActivate = (item: ModalInputSelection<TData>) => {
    if (item.disabled) return;
    if (mode === 'single' && commitOnItemClick) {
      commitSelection([item]);
      return;
    }
    toggleDraftSelection(item);
  };

  const toCssSize = (size: number | string) => (typeof size === 'number' ? `${size}px` : size);
  const resolvedModalWidth = modalWidth != null ? toCssSize(modalWidth) : undefined;
  const resolvedModalHeight = modalHeight != null ? toCssSize(modalHeight) : undefined;
  const hasTableColumns = Array.isArray(listColumns) && listColumns.length > 0;
  const showSelector = mode === 'multi';
  const gridTemplateColumns = hasTableColumns
    ? [
        ...(showSelector ? ['2rem'] : []),
        ...(listColumns as ModalInputListColumn<TData>[]).map((col) => col.width ?? 'minmax(0, 1fr)'),
      ].join(' ')
    : undefined;

  const handleHeaderPointerDown: React.PointerEventHandler<HTMLDivElement> = (event) => {
    if (!draggable) return;
    if (event.button !== 0) return;

    const target = event.target as HTMLElement;
    if (target.closest('button, input, textarea, select, a, [role="button"]')) {
      return;
    }

    const node = contentRef.current;
    if (!node) return;

    const rect = node.getBoundingClientRect();
    dragStateRef.current = {
      pointerId: event.pointerId,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
    };
    setPosition({ left: rect.left, top: rect.top });
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
  };

  const handleHeaderPointerMove: React.PointerEventHandler<HTMLDivElement> = (event) => {
    const dragState = dragStateRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) return;

    setPosition({
      left: event.clientX - dragState.offsetX,
      top: event.clientY - dragState.offsetY,
    });
  };

  const handleHeaderPointerUp: React.PointerEventHandler<HTMLDivElement> = (event) => {
    const dragState = dragStateRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) return;

    dragStateRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const renderTriggerInput = (ariaLabel?: string) => (
    <Input
      value={readOnly ? resolvedDisplayValue : inputValue}
      onChange={(event) => {
        if (readOnly) return;
        const nextValue = event.target.value;
        setInputValue(nextValue);
        applySelection([]);
        if (searchOnInputChange) {
          if (!open) setOpen(true);
          setSearchValue(nextValue);
        }
      }}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      clearable={clearable}
      clearLabel={clearLabel}
      onClear={clearSelection}
      autoSelect={false}
      label={label}
      helperText={helperText}
      error={error}
      required={required}
      fullWidth={fullWidth}
      className={inputClassName}
      aria-label={ariaLabel}
      onFocus={() => {
        if (skipNextFocusOpenRef.current) {
          skipNextFocusOpenRef.current = false;
          return;
        }
        if (!disabled && openOnInputFocus) setOpen(true);
      }}
      onKeyDown={(event) => {
        if (event.key !== 'Enter') return;
        event.preventDefault();
        if (!disabled) setOpen(true);
      }}
      suffix={
        <button
          type="button"
          className={styles.triggerButton}
          aria-label={triggerAriaLabel}
          disabled={disabled}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => setOpen(true)}
        >
          {triggerIcon ?? <Search size={14} aria-hidden={true} />}
        </button>
      }
    />
  );

  return (
    <div
      className={clsx(
        !hideTrigger && styles.root,
        !hideTrigger && fullWidth && styles.fullWidth,
        className
      )}
    >
      {!hideTrigger ? (
        showSelectedTooltip ? (
          <TooltipProvider delayDuration={300}>
            <Tooltip open={open ? false : undefined}>
              <TooltipTrigger asChild>
                <div className={styles.triggerAnchor}>{renderTriggerInput(inputAriaLabel)}</div>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                align="start"
                className={styles.selectedTooltipContent}
              >
                {selectedTooltipContent}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          renderTriggerInput(inputAriaLabel)
        )
      ) : null}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          ref={setDialogContentNode}
          className={clsx(styles.dialog, dialogClassName)}
          showClose={false}
          data-gen-grid-editor-overlay="true"
          data-gen-datagrid-editor-surface="true"
          style={
            {
              ...(resolvedModalWidth
                ? {
                    width: resolvedModalWidth,
                    maxWidth: resolvedModalWidth,
                  }
                : {}),
              ...(resolvedModalHeight
                ? {
                    height: `min(${resolvedModalHeight}, 85vh)`,
                    maxHeight: '85vh',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                  }
                : {}),
              ...(position
                ? {
                    left: `${position.left}px`,
                    top: `${position.top}px`,
                    transform: 'none',
                  }
                : {}),
            }
          }
        >
          <DialogHeader
            className={clsx(styles.dialogHeader, draggable && styles.draggableHeader)}
            onPointerDown={handleHeaderPointerDown}
            onPointerMove={handleHeaderPointerMove}
            onPointerUp={handleHeaderPointerUp}
            onPointerCancel={handleHeaderPointerUp}
          >
            <div className={styles.headerRow}>
              <div className={styles.titleWrap}>
                <DialogTitle className={styles.dialogTitle}>{title}</DialogTitle>
                {mode === 'multi' ? (
                  <span className={styles.selectionCount}>
                    {draftSelectedItems.length} selected
                  </span>
                ) : null}
              </div>
              <DialogClose className={styles.dialogCloseButton} aria-label="Close">
                <X size={16} aria-hidden={true} />
              </DialogClose>
            </div>
          </DialogHeader>
          <DialogBody className={styles.dialogBody}>
            <div className={styles.content}>
              {modalDescription ? <div className={styles.itemMeta}>{modalDescription}</div> : null}
              <div className={styles.searchRow}>
                <Input
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  placeholder={searchPlaceholder}
                  autoFocus={autoFocusSearch}
                  clearable={true}
                  fullWidth={true}
                  autoSelect={false}
                  onKeyDown={(event) => {
                    if (event.key === 'Escape') {
                      event.preventDefault();
                      event.stopPropagation();
                      setOpen(false);
                    }
                    if (event.key === 'Enter' && mode === 'single' && visibleItems.length === 1) {
                      event.preventDefault();
                      const only = visibleItems[0];
                      if (!only.disabled) commitSelection([only]);
                    }
                    if (event.key === 'Enter' && mode === 'multi') {
                      event.preventDefault();
                      commitSelection(draftSelectedItems);
                    }
                  }}
                />
                {mode === 'multi' ? (
                  <label className={styles.selectedOnlyToggle}>
                    <input
                      type="checkbox"
                      checked={showSelectedOnly}
                      onChange={(event) => setShowSelectedOnly(event.target.checked)}
                    />
                    선택만 보기
                  </label>
                ) : null}
              </div>

              <div
                className={clsx(styles.listWrap, listClassName)}
                role="listbox"
                aria-multiselectable={mode === 'multi'}
              >
                {loading ? (
                  <div className={styles.empty}>{loadingMessage}</div>
                ) : visibleItems.length === 0 ? (
                  <div className={styles.empty}>{emptyMessage}</div>
                ) : hasTableColumns ? (
                  <div className={styles.table}>
                    <div
                      className={styles.tableHeader}
                      style={gridTemplateColumns ? { gridTemplateColumns } : undefined}
                    >
                      {showSelector ? <div className={styles.tableHeaderCell} /> : null}
                      {(listColumns as ModalInputListColumn<TData>[]).map((column) => (
                        <div
                          key={column.key}
                          className={clsx(
                            styles.tableHeaderCell,
                            column.align === 'center' && styles.alignCenter,
                            column.align === 'right' && styles.alignRight
                          )}
                        >
                          {column.header}
                        </div>
                      ))}
                    </div>
                    <div className={styles.tableBody}>
                      {visibleItems.map((item) => {
                        const selected = draftSelectedKeySet.has(item.value);
                        return (
                          <button
                            key={`${item.value}:${item.label}`}
                            type="button"
                            className={styles.tableRow}
                            data-selected={selected ? 'true' : 'false'}
                            style={gridTemplateColumns ? { gridTemplateColumns } : undefined}
                            disabled={item.disabled}
                            aria-selected={selected}
                            onClick={() => handleItemActivate(item)}
                            onDoubleClick={() => {
                              if (mode !== 'single' || !confirmOnDoubleClick || commitOnItemClick) {
                                return;
                              }
                              commitSelection([item]);
                            }}
                          >
                            {showSelector ? (
                              <span className={styles.selector} aria-hidden={true}>
                                {selected ? '✓' : ''}
                              </span>
                            ) : null}
                            {(listColumns as ModalInputListColumn<TData>[]).map((column) => (
                              <span
                                key={`${item.value}:${column.key}`}
                                className={clsx(
                                  styles.tableCell,
                                  column.align === 'center' && styles.alignCenter,
                                  column.align === 'right' && styles.alignRight
                                )}
                              >
                                {column.render(item)}
                              </span>
                            ))}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className={styles.list}>
                    {visibleItems.map((item) => {
                      const selected = draftSelectedKeySet.has(item.value);
                      return (
                        <button
                          key={`${item.value}:${item.label}`}
                          type="button"
                          className={styles.item}
                          data-selected={selected ? 'true' : 'false'}
                          disabled={item.disabled}
                          aria-selected={selected}
                          onClick={() => handleItemActivate(item)}
                          onDoubleClick={() => {
                            if (mode !== 'single' || !confirmOnDoubleClick || commitOnItemClick) {
                              return;
                            }
                            commitSelection([item]);
                          }}
                        >
                          <span className={styles.itemBody}>
                            {showSelector ? (
                              <span className={styles.selector} aria-hidden={true}>
                                {selected ? '✓' : ''}
                              </span>
                            ) : null}
                            <span className={styles.itemContent}>
                              <span className={styles.itemTitle}>{item.label}</span>
                              <span className={styles.itemMeta}>{item.description ?? item.value}</span>
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <div className={styles.footer}>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                {cancelLabel}
              </Button>
              {!(mode === 'single' && commitOnItemClick) ? (
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => commitSelection(draftSelectedItems)}
                  disabled={mode === 'single' && draftSelectedItems.length === 0}
                >
                  {confirmLabel}
                </Button>
              ) : null}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
