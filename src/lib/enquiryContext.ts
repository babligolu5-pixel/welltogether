import { createContext, useContext } from 'react';
import type { EnquiryTarget } from './types';

export const EnquiryContext = createContext<(target?: EnquiryTarget) => void>(
  () => {},
);

export const useEnquiry = () => useContext(EnquiryContext);
