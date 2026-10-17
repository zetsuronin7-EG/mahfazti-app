/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { WalletProvider } from './context/WalletContext';
import { ActiveTab, Transaction, TransactionType, Wallet } from './types';
import { TopBar } from './components/TopBar';
import { BottomNav } from './components/BottomNav';
import { OfflineIndicator } from './components/OfflineIndicator';
import { DashboardView } from './components/DashboardView';
import { WalletsView } from './components/WalletsView';
import { TransactionsView } from './components/TransactionsView';
import { AnalyticsView } from './components/AnalyticsView';
import { SettingsView } from './components/SettingsView';
import { AddTransactionModal } from './components/modals/AddTransactionModal';
import { TransferModal } from './components/modals/TransferModal';
import { WalletModal } from './components/modals/WalletModal';
import { TransactionDetailModal } from './components/modals/TransactionDetailModal';
import { ShareModal } from './components/modals/ShareModal';
import { ApkGuideModal } from './components/modals/ApkGuideModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Modal states
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const [addTxDefaultType, setAddTxDefaultType] = useState<TransactionType>('expense');
  const [addTxDefaultWalletId, setAddTxDefaultWalletId] = useState<string | undefined>(undefined);

  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [transferDefaultSourceId, setTransferDefaultSourceId] = useState<string | undefined>(undefined);

  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [walletToEdit, setWalletToEdit] = useState<Wallet | null>(null);

  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);

  const handleOpenAddExpense = (walletId?: string) => {
    setAddTxDefaultType('expense');
    setAddTxDefaultWalletId(walletId);
    setIsAddTxOpen(true);
  };

  const handleOpenAddIncome = (walletId?: string) => {
    setAddTxDefaultType('income');
    setAddTxDefaultWalletId(walletId);
    setIsAddTxOpen(true);
  };

  const handleOpenTransfer = (sourceWalletId?: string) => {
    setTransferDefaultSourceId(sourceWalletId);
    setIsTransferOpen(true);
  };

  const handleOpenCreateWallet = () => {
    setWalletToEdit(null);
    setIsWalletModalOpen(true);
  };

  const handleOpenEditWallet = (wallet: Wallet) => {
    setWalletToEdit(wallet);
    setIsWalletModalOpen(true);
  };

  return (
    <WalletProvider>
      <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
        {/* Offline connectivity toast */}
        <OfflineIndicator />

        {/* Top Header Bar */}
        <TopBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenAddExpense={() => handleOpenAddExpense()}
          onOpenTransfer={() => handleOpenTransfer()}
          onOpenShare={() => setIsShareOpen(true)}
          onOpenApkGuide={() => setIsApkModalOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-5 sm:py-6">
          {activeTab === 'dashboard' && (
            <DashboardView
              setActiveTab={setActiveTab}
              onOpenAddExpense={() => handleOpenAddExpense()}
              onOpenAddIncome={() => handleOpenAddIncome()}
              onOpenTransfer={() => handleOpenTransfer()}
              onOpenAddWallet={handleOpenCreateWallet}
              onSelectTransaction={(tx) => setSelectedTransaction(tx)}
            />
          )}

          {activeTab === 'wallets' && (
            <WalletsView
              onOpenAddWallet={handleOpenCreateWallet}
              onEditWallet={handleOpenEditWallet}
              onTransferFromWallet={(wId) => handleOpenTransfer(wId)}
              onSelectTransaction={(tx) => setSelectedTransaction(tx)}
            />
          )}

          {activeTab === 'transactions' && (
            <TransactionsView
              onOpenAddExpense={() => handleOpenAddExpense()}
              onOpenAddIncome={() => handleOpenAddIncome()}
              onOpenTransfer={() => handleOpenTransfer()}
              onSelectTransaction={(tx) => setSelectedTransaction(tx)}
            />
          )}

          {activeTab === 'analytics' && <AnalyticsView />}

          {activeTab === 'settings' && (
            <SettingsView
              onOpenShare={() => setIsShareOpen(true)}
              onOpenApkGuide={() => setIsApkModalOpen(true)}
            />
          )}
        </main>

        {/* Mobile Fixed Thumb Navigation Bar */}
        <BottomNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenQuickAdd={() => handleOpenAddExpense()}
        />

        {/* Modals & Dialogs */}
        {isAddTxOpen && (
          <AddTransactionModal
            isOpen={isAddTxOpen}
            onClose={() => setIsAddTxOpen(false)}
            defaultType={addTxDefaultType}
            defaultWalletId={addTxDefaultWalletId}
            onOpenAddWallet={handleOpenCreateWallet}
          />
        )}

        {isTransferOpen && (
          <TransferModal
            isOpen={isTransferOpen}
            onClose={() => setIsTransferOpen(false)}
            defaultSourceId={transferDefaultSourceId}
            onOpenAddWallet={handleOpenCreateWallet}
          />
        )}

        {isWalletModalOpen && (
          <WalletModal
            isOpen={isWalletModalOpen}
            onClose={() => setIsWalletModalOpen(false)}
            walletToEdit={walletToEdit}
          />
        )}

        {selectedTransaction && (
          <TransactionDetailModal
            transaction={selectedTransaction}
            onClose={() => setSelectedTransaction(null)}
          />
        )}

        {isShareOpen && (
          <ShareModal
            isOpen={isShareOpen}
            onClose={() => setIsShareOpen(false)}
            onOpenApkGuide={() => {
              setIsShareOpen(false);
              setIsApkModalOpen(true);
            }}
          />
        )}

        {isApkModalOpen && (
          <ApkGuideModal
            isOpen={isApkModalOpen}
            onClose={() => setIsApkModalOpen(false)}
          />
        )}
      </div>
    </WalletProvider>
  );
}
