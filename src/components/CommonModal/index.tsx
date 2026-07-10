'use client';

import './index.css';

import clsx from 'clsx';
import { useEffect, type JSX, type ReactNode } from 'react';
import { MdClear } from 'react-icons/md';
import Modal from 'react-modal';

interface Props {
  children: ReactNode;
  opened: boolean;

  className?: string;
  onClose?: () => void;
}

export function CommonModal({
  className,
  children,
  opened,
  onClose,
}: Props): JSX.Element {
  useEffect(() => {
    Modal.setAppElement('.content');
  });

  return (
    <Modal
      className={clsx('modal', className)}
      isOpen={opened}
      onRequestClose={onClose}
    >
      <button
        className={clsx('button', 'closeModal')}
        type="button"
        onClick={onClose}
      >
        <MdClear />
      </button>
      {children}
    </Modal>
  );
}
