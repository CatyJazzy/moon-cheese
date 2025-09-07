import { Box, Flex, styled } from 'styled-system/jsx';
import { ProgressBar, Spacing, Text } from '@/ui-lib';
import { getUserInfo, getGradePointList } from '@/apis/userInfo';
import { useSuspenseQueries, useQueryClient } from '@tanstack/react-query';
import DataWrapper from '@/components/DataWrapper';

function CurrentLevelSection() {
  const queryClient = useQueryClient();

  const handleRetry = () => {
    queryClient.invalidateQueries({ queryKey: ['userInfo'] });
    queryClient.invalidateQueries({ queryKey: ['gradeInfo'] });
  };

  return (
    <styled.section css={{ px: 5, py: 4 }}>
      <Text variant="H1_Bold">현재 등급</Text>

      <Spacing size={4} />

      <DataWrapper onRetry={handleRetry}>
        <CurrentLevelContents />
      </DataWrapper>
    </styled.section>
  );
}

function CurrentLevelContents() {
  const [{ data: userInfo }, { data: gradeInfo }] = useSuspenseQueries({
    queries: [
      {
        queryKey: ['userInfo'],
        queryFn: getUserInfo,
      },
      {
        queryKey: ['gradeInfo'],
        queryFn: getGradePointList,
      },
    ],
  });

  const getNextGradeInfo = () => {
    const gradePointList = gradeInfo.gradePointList;
    const { point: userPoint, grade: userGrade } = userInfo;
    const currentGradeIdx = gradePointList.findIndex(grade => grade.type === userGrade);

    const nextGrade = gradePointList[currentGradeIdx + 1];

    if (!nextGrade) {
      return { remainingPoints: 0, progress: 1 };
    }

    const remainingPoints = nextGrade.minPoint - userPoint;
    const progress = userPoint / nextGrade.minPoint;
    return { remainingPoints, progress };
  };

  const { remainingPoints, progress } = getNextGradeInfo();

  return (
    <Box bg="background.01_white" css={{ px: 5, py: 4, rounded: '2xl' }}>
      <Flex flexDir="column" gap={2}>
        <Text variant="H2_Bold">{userInfo?.grade || 'EXPLORER'}</Text>

        <ProgressBar value={progress} size="xs" />

        <Flex justifyContent="space-between">
          <Box textAlign="left">
            <Text variant="C1_Bold">현재 포인트</Text>
            <Text variant="C2_Regular" color="neutral.03_gray">
              {userInfo?.point || 0}p
            </Text>
          </Box>
          <Box textAlign="right">
            <Text variant="C1_Bold">다음 등급까지</Text>
            <Text variant="C2_Regular" color="neutral.03_gray">
              {remainingPoints}p
            </Text>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}

export default CurrentLevelSection;
