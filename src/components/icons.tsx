import React from 'react';

export const BackspaceIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className || "h-6 w-6"}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 002.828 0L21 12M3 12l6.414-6.414a2 2 0 012.828 0L21 12"
    />
  </svg>
);

export const MusicOnIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} viewBox="0 0 20 20" fill="currentColor">
    <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3V3z" />
  </svg>
);

export const MusicOffIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12.114A4.369 4.369 0 009 16c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3V7.82l8-1.6v5.894A4.37 4.37 0 0019 12c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3V3a1 1 0 00-1.196-.98l-10 2A1 1 0 009 5v.114l-2.553-1.276a1 1 0 00-1.17 1.66l1.103.552zM4.03 4.03a1 1 0 011.414 0L16.97 15.566a1 1 0 01-1.414 1.414L4.03 5.444a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);


export const SfxOnIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12.114A4.369 4.369 0 009 16c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3V4.82l7 1.4v1.494A4.37 4.37 0 0017 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3V3a1 1 0 00-.894-.99l-9-2A1 1 0 0010 1H5a1 1 0 00-1 1v2a1 1 0 001 1h1.586l-2.293 2.293A1 1 0 005.707 8.707L8 6.414V5a1 1 0 00-1-1H5a1 1 0 00-1 1v.707L1.707 9.293a1 1 0 101.414 1.414L5 8.828V11a1 1 0 001 1h2.172l-2.879 2.879a1 1 0 101.414 1.414L9 13.414V14a1 1 0 001 1h.114z" clipRule="evenodd" />
    </svg>
);

export const SfxOffIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12.114A4.369 4.369 0 009 16c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3V4.82l7 1.4v1.494A4.37 4.37 0 0017 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3V3a1 1 0 00-.894-.99l-9-2A1 1 0 0010 1H5a1 1 0 00-1 1v2a1 1 0 001 1h1.586l-2.293 2.293A1 1 0 005.707 8.707L8 6.414V5a1 1 0 00-1-1H5a1 1 0 00-1 1v.707L1.707 9.293a1 1 0 101.414 1.414L5 8.828V11a1 1 0 001 1h2.172l-2.879 2.879a1 1 0 101.414 1.414L9 13.414V14a1 1 0 001 1h.114zM4.03 4.03a1 1 0 011.414 0L16.97 15.566a1 1 0 01-1.414 1.414L4.03 5.444a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);