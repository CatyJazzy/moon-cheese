import { Center, styled, VStack } from 'styled-system/jsx';
import { Text } from '@/ui-lib';

function Loading({ guide }: { guide: string }) {
  return (
    <Center p={5} bgColor="background.01_white">
      <VStack gap={4}>
        <VStack gap={2} textAlign="center">
          <styled.div
            css={{
              width: '40px',
              height: '40px',
              border: '3px solid #f3f3f3',
              borderTop: '3px solid #fbbf24',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
          <Text variant="C2_Regular">{guide}</Text>
        </VStack>
      </VStack>
    </Center>
  );
}

export default Loading;
