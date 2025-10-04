import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Copy, ExternalLink, Share2 } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner@2.0.3";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
  shareTitle: string;
  shareText: string;
}

export function ShareModal({ isOpen, onClose, shareUrl, shareTitle, shareText }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = () => {
    // 안전한 복사 방법
    const textArea = document.createElement('textarea');
    textArea.value = shareUrl;
    textArea.style.position = 'absolute';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        setCopied(true);
        toast.success("링크가 복사되었습니다! 📋");
        setTimeout(() => setCopied(false), 2000);
      } else {
        throw new Error('Copy failed');
      }
    } catch (err) {
      document.body.removeChild(textArea);
      toast.error("수동으로 링크를 선택하여 복사해주세요");
    }
  };

  const handleCopyFull = () => {
    const fullText = `${shareTitle}\n\n${shareText}\n\n🔗 ${shareUrl}`;
    
    const textArea = document.createElement('textarea');
    textArea.value = fullText;
    textArea.style.position = 'absolute';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        toast.success("전체 내용이 복사되었습니다! 📋");
        onClose();
      } else {
        throw new Error('Copy failed');
      }
    } catch (err) {
      document.body.removeChild(textArea);
      toast.error("수동으로 내용을 선택하여 복사해주세요");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-50 max-w-sm mx-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-yellow-500 rounded-full flex items-center justify-center">
                  <Share2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">공유하기</h3>
                  <p className="text-sm text-gray-500">맛집 정보를 공유하세요</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Share Preview */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">{shareTitle}</h4>
                <p className="text-sm text-gray-600 whitespace-pre-line mb-3">{shareText}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <ExternalLink className="w-3 h-3" />
                  <span className="truncate">{shareUrl}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleCopyFull}
                  className="w-full bg-gradient-to-r from-red-500 to-yellow-500 hover:from-red-600 hover:to-yellow-600 text-white"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  전체 내용 복사하기
                </Button>

                <Button
                  onClick={handleCopyUrl}
                  variant="outline"
                  className="w-full border-gray-300 hover:bg-gray-50"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {copied ? "복사됨! ✓" : "링크만 복사하기"}
                </Button>
              </div>

              {/* Manual Guide */}
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <p className="text-xs text-blue-700">
                  💡 <strong>수동 복사 방법:</strong><br />
                  위의 회색 상자를 길게 눌러 텍스트를 선택한 후<br />
                  '복사' 메뉴를 선택하세요
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}