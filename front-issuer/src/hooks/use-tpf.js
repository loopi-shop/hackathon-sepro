import { useContext } from 'react';
import { TPFContext } from 'src/contexts/tpf-context';

export const useTPF = () => useContext(TPFContext);
