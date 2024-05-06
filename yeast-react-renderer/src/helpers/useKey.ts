// import { useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

export function useKey() {
	// Note: useRef was causing an error in React about hooks. Cause unclear.
	// return useRef<string>(uuidv4());
	return { current: uuidv4() };
}
