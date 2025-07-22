#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * 릴리즈 노트 생성 스크립트
 * 커밋 메시지 기반으로 체계적인 릴리즈 노트를 생성합니다.
 */
class ReleaseNotesGenerator {
  constructor() {
    this.commitTypes = {
      feat: { title: 'Features', changelogType: 'Added' }, // ✨ Feature
      fix: { title: 'Bug Fixes', changelogType: 'Fixed' }, // 🐛 Bug
      hotfix: { title: 'Hotfixes', changelogType: 'Fixed' }, // 🚑 Hotfix
      refactor: { title: 'Refactoring', changelogType: 'Changed' }, // ♻️ Refactor
      chore: { title: 'Chores', changelogType: 'Changed' }, // ⚙️ Chore
      docs: { title: 'Documentation', changelogType: 'Changed' }, // 📝 Docs
      design: { title: 'Design', changelogType: 'Changed' }, // 🎨 Design
    };
  }

  /**
   * Git 명령어 실행
   */
  execGit(command) {
    try {
      return execSync(command, { encoding: 'utf8' }).trim();
    } catch (error) {
      console.error(`Git command failed: ${command}`);
      console.error(error.message);
      return '';
    }
  }

  /**
   * 마지막 릴리즈 태그 가져오기
   */
  getLastTag() {
    const lastTag = this.execGit('git describe --tags --abbrev=0 2>/dev/null || echo ""');
    return lastTag || null;
  }

  /**
   * package.json에서 현재 버전 읽기
   */
  getCurrentPackageVersion() {
    try {
      const packageJsonPath = path.join(__dirname, '..', 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      return packageJson.version;
    } catch (error) {
      console.warn('Could not read package.json version, defaulting to 0.0.0');
      return '0.0.0';
    }
  }

  /**
   * 태그가 현재 브랜치에서 접근 가능한지 확인 (orphaned tag 감지)
   */
  isTagReachable(tag) {
    try {
      this.execGit(`git merge-base --is-ancestor ${tag} HEAD`);
      return true;
    } catch (error) {
      return false; // orphaned tag 또는 접근 불가능한 태그
    }
  }

  /**
   * 새로운 버전 계산
   */
  calculateNewVersion(lastTag, commits) {
    let baseVersion;
    let isFromTag = false;

    // 태그가 없거나 orphaned tag인 경우 package.json 기준으로 계산
    if (!lastTag || !this.isTagReachable(lastTag)) {
      console.log('📦 Using package.json version as base (no reachable tag found)');
      baseVersion = this.getCurrentPackageVersion();
    } else {
      console.log(`🏷️  Using tag ${lastTag} as base version`);
      baseVersion = lastTag.replace(/^v/, '');
      isFromTag = true;
    }

    const versionMatch = baseVersion.match(/^(\d+)\.(\d+)\.(\d+)/);
    if (!versionMatch) {
      console.warn('Invalid version format, defaulting to 1.0.0');
      return 'v1.0.0';
    }

    let [, major, minor, patch] = versionMatch.map(Number);

    // 강제 버전 타입이 설정된 경우
    const forceVersionType = process.env.FORCE_VERSION_TYPE;
    if (forceVersionType && forceVersionType !== 'auto') {
      switch (forceVersionType) {
        case 'major':
          major++;
          minor = 0;
          patch = 0;
          break;
        case 'minor':
          minor++;
          patch = 0;
          break;
        case 'patch':
          patch++;
          break;
      }
      return `v${major}.${minor}.${patch}`;
    }

    // 자동 버전 계산
    // Breaking changes 확인
    if (
      commits.some(
        (commit) => commit.message.includes('BREAKING CHANGE') || commit.message.includes('!:')
      )
    ) {
      major++;
      minor = 0;
      patch = 0;
    }
    // Features 확인
    else if (commits.some((commit) => commit.type === 'feat')) {
      minor++;
      patch = 0;
    }
    // Bug fixes 또는 기타 변경사항
    else {
      patch++;
    }

    return `v${major}.${minor}.${patch}`;
  }

  /**
   * 커밋 메시지 파싱
   */
  parseCommit(commitLine) {
    const match = commitLine.match(/^([a-f0-9]+)\s+(.+)$/);
    if (!match) return null;

    const [, hash, message] = match;

    // Conventional Commits 형식 파싱 (콜론 형식)
    const conventionalMatch = message.match(
      /^(feat|fix|docs|settings|refactor|test|chore|design|comment|rename|remove)(\(.+\))?(!?):\s*(.+)$/
    );

    if (conventionalMatch) {
      const [, type, scope, breaking, description] = conventionalMatch;
      return {
        hash,
        type,
        scope: scope ? scope.slice(1, -1) : null,
        breaking: breaking === '!',
        description,
        message,
      };
    }

    // 대괄호 형식 파싱 [feat], [fix] 등
    const bracketMatch = message.match(
      /^\[(feat|fix|docs|settings|refactor|test|chore|design|comment|rename|remove)\]\s*(.+)$/
    );

    if (bracketMatch) {
      const [, type, description] = bracketMatch;
      return {
        hash,
        type,
        scope: null,
        breaking: false,
        description,
        message,
      };
    }

    return {
      hash,
      type: 'other',
      scope: null,
      breaking: false,
      description: message,
      message,
    };
  }

  /**
   * 커밋 범위에서 커밋 목록 가져오기
   */
  getCommits(range) {
    const commitLines = this.execGit(`git log ${range} --oneline --no-merges`)
      .split('\n')
      .filter((line) => line.trim());

    return commitLines.map((line) => this.parseCommit(line)).filter((commit) => commit !== null);
  }

  /**
   * 기여자 목록 가져오기
   */
  getContributors(range) {
    const contributors = this.execGit(`git log ${range} --format='%an <%ae>' | sort -u`)
      .split('\n')
      .filter((line) => line.trim());
    return contributors;
  }

  /**
   * CHANGELOG.md 업데이트
   */
  updateChangelog(newVersion, commits) {
    const changelogPath = path.join(__dirname, '..', 'CHANGELOG.md');
    const now = new Date();
    const releaseDate = now.toISOString().split('T')[0];

    let changelogContent = '';
    if (fs.existsSync(changelogPath)) {
      changelogContent = fs.readFileSync(changelogPath, 'utf8');
    }

    // 타입별로 커밋 분류 (Keep a Changelog 형식)
    const changelogTypes = {
      Added: [],
      Changed: [],
      Fixed: [],
      Removed: [],
      Security: [],
    };

    commits.forEach((commit) => {
      const typeConfig = this.commitTypes[commit.type];
      const changelogType = typeConfig ? typeConfig.changelogType : 'Changed';

      if (changelogTypes[changelogType]) {
        const scopeText = commit.scope ? `**${commit.scope}**: ` : '';
        changelogTypes[changelogType].push(`- ${scopeText}${commit.description}`);
      }
    });

    // Breaking changes는 별도로 처리
    const breakingChanges = commits.filter((commit) => commit.breaking);
    if (breakingChanges.length > 0) {
      breakingChanges.forEach((commit) => {
        const scopeText = commit.scope ? `**${commit.scope}**: ` : '';
        changelogTypes.Changed.push(`- **BREAKING**: ${scopeText}${commit.description}`);
      });
    }

    // 새로운 릴리즈 섹션 생성
    let newReleaseSection = `\n## [${newVersion.replace('v', '')}] - ${releaseDate}`;

    Object.entries(changelogTypes).forEach(([type, items]) => {
      if (items.length > 0) {
        newReleaseSection += `\n\n### ${type}\n${items.join('\n')}`;
      }
    });

    // CHANGELOG.md 업데이트
    const unreleasedMatch = changelogContent.match(/(## \[Unreleased\][\s\S]*?)(?=\n## |$)/);

    if (unreleasedMatch) {
      // Unreleased 섹션 다음에 새로운 릴리즈 추가
      const beforeUnreleased = changelogContent.substring(
        0,
        unreleasedMatch.index + unreleasedMatch[0].length
      );
      const afterUnreleased = changelogContent.substring(
        unreleasedMatch.index + unreleasedMatch[0].length
      );

      const updatedContent = beforeUnreleased + newReleaseSection + afterUnreleased;
      fs.writeFileSync(changelogPath, updatedContent);
    } else {
      // Unreleased 섹션이 없으면 첫 번째 ## 다음에 추가
      const firstSectionMatch = changelogContent.match(/(\n## )/);
      if (firstSectionMatch) {
        const insertIndex = firstSectionMatch.index;
        const updatedContent =
          changelogContent.substring(0, insertIndex) +
          newReleaseSection +
          changelogContent.substring(insertIndex);
        fs.writeFileSync(changelogPath, updatedContent);
      }
    }

    console.log(`✅ CHANGELOG.md updated with version ${newVersion}`);
  }

  /**
   * 릴리즈 노트 생성
   */
  generateReleaseNotes(newVersion, commits, contributors, lastTag) {
    const now = new Date();
    const releaseDate = now.toISOString().split('T')[0];

    let notes = `# Release ${newVersion}

## Release Date
${releaseDate}

## Changes
`;

    // 타입별로 커밋 분류
    const commitsByType = {};
    commits.forEach((commit) => {
      if (!commitsByType[commit.type]) {
        commitsByType[commit.type] = [];
      }
      commitsByType[commit.type].push(commit);
    });

    // Breaking Changes 먼저 표시
    const breakingChanges = commits.filter((commit) => commit.breaking);
    if (breakingChanges.length > 0) {
      notes += `\n### BREAKING CHANGES\n`;
      breakingChanges.forEach((commit) => {
        notes += `- ${commit.description} (${commit.hash})\n`;
      });
    }

    // 각 타입별 커밋 표시
    Object.entries(this.commitTypes).forEach(([type, config]) => {
      if (commitsByType[type] && commitsByType[type].length > 0) {
        notes += `\n### ${config.title}\n`;
        commitsByType[type].forEach((commit) => {
          const scopeText = commit.scope ? `**${commit.scope}**: ` : '';
          notes += `- ${scopeText}${commit.description} (${commit.hash})\n`;
        });
      }
    });

    // 기타 변경사항
    if (commitsByType.other && commitsByType.other.length > 0) {
      notes += `\n### Other Changes\n`;
      commitsByType.other.forEach((commit) => {
        notes += `- ${commit.description} (${commit.hash})\n`;
      });
    }

    // 기여자 정보
    if (contributors.length > 0) {
      notes += `\n## Contributors\n`;
      contributors.forEach((contributor) => {
        notes += `- ${contributor}\n`;
      });
    }

    // 전체 변경사항 링크
    const repoUrl = this.getRepositoryUrl();
    if (repoUrl && lastTag) {
      notes += `\n---\n**Full Changelog**: ${repoUrl}/compare/${lastTag}...${newVersion}\n`;
    }

    return notes;
  }

  /**
   * 저장소 URL 가져오기
   */
  getRepositoryUrl() {
    try {
      const remoteUrl = this.execGit('git config --get remote.origin.url');
      if (remoteUrl.includes('github.com')) {
        return remoteUrl.replace(/^git@github\.com:/, 'https://github.com/').replace(/\.git$/, '');
      }
    } catch (error) {
      console.warn('Could not determine repository URL');
    }
    return null;
  }

  /**
   * 메인 실행 함수
   */
  async run() {
    console.log('🚀 Generating release notes...');

    const lastTag = this.getLastTag();
    const range = lastTag ? `${lastTag}..HEAD` : '8dc9491c..HEAD';

    console.log(`📋 Analyzing commits from ${range}`);
    if (lastTag) {
      console.log(`📌 Last tag: ${lastTag}`);
    } else {
      console.log('📌 Starting from commit 8dc9491c - initial environment setup');
    }

    const commits = this.getCommits(range);
    if (commits.length === 0) {
      console.log('ℹ️  No commits found for release');
      process.exit(0);
    }

    const newVersion = this.calculateNewVersion(lastTag, commits);
    const contributors = this.getContributors(range);

    console.log(`📦 New version: ${newVersion}`);
    console.log(`📝 Found ${commits.length} commits`);
    console.log(`👥 Found ${contributors.length} contributors`);

    // 버전 타입 강제 설정 확인
    const forceVersionType = process.env.FORCE_VERSION_TYPE;
    if (forceVersionType && forceVersionType !== 'auto') {
      console.log(`🔧 Forced version type: ${forceVersionType}`);
    }

    const releaseNotes = this.generateReleaseNotes(newVersion, commits, contributors, lastTag);

    // CHANGELOG.md 업데이트
    this.updateChangelog(newVersion, commits);

    // 릴리즈 노트 파일 저장
    const outputPath = path.join(__dirname, '..', 'release_notes.md');
    fs.writeFileSync(outputPath, releaseNotes);

    console.log(`✅ Release notes generated: ${outputPath}`);
    console.log(`🔖 Version: ${newVersion}`);

    // GitHub Actions 출력 변수 설정
    if (process.env.GITHUB_OUTPUT) {
      try {
        fs.appendFileSync(process.env.GITHUB_OUTPUT, `NEW_VERSION=${newVersion}\n`);
        fs.appendFileSync(process.env.GITHUB_OUTPUT, `RELEASE_NOTES<<EOF\n${releaseNotes}\nEOF\n`);
        console.log('📤 GitHub Actions output variables set');
      } catch (error) {
        console.error('❌ Failed to set GitHub Actions output variables:', error.message);
      }
    }

    return { newVersion, releaseNotes };
  }
}

// 스크립트 실행
if (require.main === module) {
  const generator = new ReleaseNotesGenerator();
  generator.run().catch((error) => {
    console.error('❌ Error generating release notes:', error);
    process.exit(1);
  });
}

module.exports = ReleaseNotesGenerator;
