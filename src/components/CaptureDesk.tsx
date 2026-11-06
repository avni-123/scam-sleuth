import React, { useRef, useState } from 'react';
import {
  UploadCloud,
  Camera,
  FileText,
  Smartphone,
  Sparkles,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { SAMPLE_PRESETS } from '../data/samplePresets.ts';
import { ExtractionResult, SamplePreset } from '../types.ts';

interface CaptureDeskProps {
  onStartExtraction: (params: {
    imageBase64?: string;
    sampleId?: string;
    file?: File;
    preset?: SamplePreset;
  }) => Promise<void>;
  isExtracting: boolean;
  extractionStep: string;
}

export const CaptureDesk: React.FC<CaptureDeskProps> = ({
  onStartExtraction,
  isExtracting,
  extractionStep,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file (JPG, PNG, WebP, etc.)');
      return;
    }
    setUploadError(null);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      await onStartExtraction({ imageBase64: base64, file });
    };
    reader.onerror = () => {
      setUploadError('Could not read the uploaded file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
      {/* Editorial Hero Statement */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFEAE1] border border-[#E0D7C6] text-xs font-medium text-[#5C5549] mb-4">
          <Sparkles className="w-3.5 h-3.5 text-[#E07A5F]" />
          <span>Capture · Understand · Confirm · Discover</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#1E1E1E] leading-[1.15] text-balance">
          Your spending, finally in focus.
        </h1>
        <p className="mt-3.5 text-base sm:text-lg text-[#5C5549] leading-relaxed">
          Drop in a crumpled kirana shop receipt, a faded thermal bill, or a quick UPI screenshot.
          KharchaKatha reads only visible truth, highlights honest doubts, and threads every payment into your personal spending story.
        </p>
      </div>

      {/* Main Capture Box */}
      <div className="bg-[#FFFFFF] border-2 border-dashed border-[#DDD5C5] rounded-2xl p-6 sm:p-10 shadow-xs relative transition-all duration-200 hover:border-[#C5BBA7] overflow-hidden mb-12">
        {/* Subtle ledger guide line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#E07A5F]" />

        {isExtracting ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-2xl bg-[#EFEAE1] flex items-center justify-center animate-pulse">
                <FileCheck className="w-8 h-8 text-[#E07A5F]" />
              </div>
              <div className="absolute -inset-2 rounded-2xl border-2 border-[#E07A5F]/40 animate-ping opacity-30" />
            </div>
            <h3 className="font-heading text-xl font-bold text-[#1E1E1E] mb-2">
              Reading receipt details...
            </h3>
            <p className="text-sm text-[#7D7565] max-w-sm mb-4">
              {extractionStep || 'Analyzing visible typography, numbers, and payment breakdown.'}
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-[#5C5549] bg-[#FBF9F5] px-3.5 py-1.5 rounded-md border border-[#E8E2D5]">
              <span className="w-2 h-2 rounded-full bg-[#E07A5F] animate-ping" />
              <span>KharchaKatha Smart OCR Active</span>
            </div>
          </div>
        ) : (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`flex flex-col items-center justify-center text-center rounded-xl p-4 transition-colors ${
              isDragging ? 'bg-[#F5EFEB]/80' : ''
            }`}
          >
            <div className="w-14 h-14 rounded-xl bg-[#F5F1E9] border border-[#E0D7C6] flex items-center justify-center text-[#2D2B2A] mb-4 shadow-xs">
              <UploadCloud className="w-7 h-7 text-[#E07A5F]" />
            </div>

            <h3 className="font-heading text-lg sm:text-xl font-bold text-[#1E1E1E] mb-1">
              Drop your receipt photo or payment screenshot
            </h3>
            <p className="text-xs sm:text-sm text-[#7D7565] max-w-md mb-6">
              Supports crumpled shop bills, thermal paper slips, Google Pay / PhonePe screenshots, and banking receipts.
            </p>

            {/* Hidden file inputs */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              accept="image/*"
              className="hidden"
            />
            <input
              type="file"
              ref={cameraInputRef}
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              accept="image/*"
              capture="environment"
              className="hidden"
            />

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 bg-[#2D2B2A] hover:bg-[#1E1E1E] text-white font-medium text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <FileText className="w-4 h-4 text-[#E07A5F]" />
                <span>Browse Files</span>
              </button>

              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 bg-[#F5F1E9] hover:bg-[#EBE4D7] text-[#2D2B2A] font-medium text-sm rounded-xl border border-[#D5CCBC] transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <Camera className="w-4 h-4 text-[#2A9D8F]" />
                <span>Take Photo</span>
              </button>
            </div>

            {uploadError && (
              <div className="mt-4 flex items-center gap-2 text-xs text-red-700 bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            <div className="mt-6 flex items-center gap-3 text-xs text-[#8C8474]">
              <span>JPG, PNG, WebP</span>
              <span aria-hidden="true">·</span>
              <span>No data sold or shared</span>
              <span aria-hidden="true">·</span>
              <span>100% Client-reviewable</span>
            </div>
          </div>
        )}
      </div>

      {/* "Try a Sample" Section for 1-minute judge evaluation */}
      <div id="sample-vault" className="mt-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-2 border-b border-[#E8E2D5]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading text-lg font-bold text-[#1E1E1E]">
                Try a realistic sample
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#2A9D8F]/10 text-[#2A9D8F] border border-[#2A9D8F]/20">
                1-Click Judge Demo
              </span>
            </div>
            <p className="text-xs text-[#7D7565] mt-0.5">
              Explore the entire Capture → Understand → Confirm flow instantly with authentic Indian payment artifacts.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {SAMPLE_PRESETS.map((preset) => (
            <div
              key={preset.id}
              className="group bg-[#FFFFFF] border border-[#E0D7C6] rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Visual Thumbnail */}
                <div className="h-44 bg-[#F5F1E9] overflow-hidden relative border-b border-[#E8E2D5]">
                  <img
                    src={preset.imagePath}
                    alt={preset.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 right-2.5">
                    <span className="text-[11px] font-semibold bg-[#2D2B2A]/90 text-white px-2.5 py-1 rounded-md backdrop-blur-xs shadow-xs">
                      {preset.badge}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-heading text-base font-bold text-[#1E1E1E]">
                      {preset.title}
                    </h3>
                  </div>
                  <p className="text-xs font-medium text-[#7D7565] mb-2.5">
                    {preset.subtitle}
                  </p>
                  <p className="text-xs text-[#5C5549] line-clamp-2 leading-relaxed">
                    {preset.summary}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  type="button"
                  disabled={isExtracting}
                  onClick={() => onStartExtraction({ sampleId: preset.id, preset })}
                  className="w-full min-h-[40px] px-3.5 py-2 bg-[#F5F1E9] hover:bg-[#E07A5F] hover:text-white text-[#2D2B2A] font-semibold text-xs rounded-lg border border-[#D5CCBC] hover:border-[#E07A5F] transition-all flex items-center justify-center gap-1.5 active:scale-[0.98] disabled:opacity-50"
                >
                  <span>Inspect & Extract Sample</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Honest Principles Footer Note */}
      <div className="mt-12 bg-[#F5F1E9]/60 border border-[#E8E2D5] rounded-xl p-4 sm:p-5 flex items-start gap-3.5 text-xs text-[#5C5549]">
        <Info className="w-5 h-5 text-[#E07A5F] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-[#1E1E1E]">
            How KharchaKatha approaches OCR & Extraction honesty:
          </p>
          <p className="leading-relaxed">
            We extract only what is actually printed. If a UPI screenshot only has a merchant and total, we will never invent fake grocery lines. If paper is crumpled or text is smudged, we flag uncertainty so you always retain full editorial control before anything enters your ledger.
          </p>
        </div>
      </div>
    </div>
  );
};
