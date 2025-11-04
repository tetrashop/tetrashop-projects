/**
 * 🎛️ مدیریت یکپارچه تمام پروژه‌های Tetrashop
 * ⚡ بهینه‌سازی و فعال‌سازی فوری
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class TetrashopUnifiedManager {
    constructor() {
        this.projects = {
            'tetrashop-optimized': {
                name: '🛒 Tetrashop معماری بهینه',
                path: '.',
                type: 'node',
                status: 'inactive',
                port: 3000,
                priority: 'high',
                dependencies: ['npm install']
            },
            'chess-engine-cpp': {
                name: '♟️ Chess Engine C++',
                path: './chess-engine-cpp',
                type: 'cpp',
                status: 'inactive', 
                port: 9002,
                priority: 'high',
                dependencies: ['make install_deps', 'make all']
            },
            'backend-api': {
                name: '🔧 Backend API',
                path: './backend',
                type: 'python',
                status: 'inactive',
                port: 8000,
                priority: 'medium',
                dependencies: ['pip install -r requirements.txt']
            },
            'intelligent-writer': {
                name: '📝 Intelligent Writer',
                path: './intelligent-writer',
                type: 'node',
                status: 'inactive',
                port: 3002,
                priority: 'medium',
                dependencies: ['npm install']
            }
        };
    }

    async emergencyRepairAll() {
        console.log('🚨 شروع ترمیم فوری تمام پروژه‌ها...\n');
        
        const startTime = Date.now();
        
        // ترمیم موازی پروژه‌ها
        const repairPromises = Object.entries(this.projects).map(([id, project]) => 
            this.emergencyRepairProject(id, project)
        );
        
        await Promise.allSettled(repairPromises);
        
        const duration = Date.now() - startTime;
        console.log(`\n✅ ترمیم فوری کامل شد! (${duration}ms)`);
        this.showSystemStatus();
    }

    async emergencyRepairProject(projectId, project) {
        console.log(`🔧 در حال ترمیم ${project.name}...`);
        
        if (!fs.existsSync(project.path)) {
            console.log(`   ❌ مسیر ${project.path} یافت نشد`);
            return;
        }

        try {
            // تغییر به مسیر پروژه
            const originalDir = process.cwd();
            process.chdir(project.path);

            // نصب وابستگی‌ها
            for (const depCommand of project.dependencies) {
                try {
                    console.log(`   📦 اجرای: ${depCommand}`);
                    execSync(depCommand, { stdio: 'inherit' });
                } catch (error) {
                    console.log(`   ⚠️ خطا در نصب وابستگی: ${error.message}`);
                }
            }

            // build پروژه
            if (project.type === 'node') {
                try {
                    execSync('npm run build', { stdio: 'inherit' });
                } catch (error) {
                    console.log(`   ⚠️ خطا در build: ${error.message}`);
                }
            } else if (project.type === 'cpp') {
                try {
                    execSync('make all', { stdio: 'inherit' });
                } catch (error) {
                    console.log(`   ⚠️ خطا در کامپایل: ${error.message}`);
                }
            }

            // بازگشت به مسیر اصلی
            process.chdir(originalDir);
            
            this.projects[projectId].status = 'repaired';
            console.log(`   ✅ ${project.name} ترمیم شد`);

        } catch (error) {
            console.log(`   ❌ خطا در ترمیم ${project.name}: ${error.message}`);
            this.projects[projectId].status = 'error';
        }
    }

    async startAllProjects() {
        console.log('🚀 راه‌اندازی تمام پروژه‌های ترمیم شده...\n');
        
        for (const [id, project] of Object.entries(this.projects)) {
            if (project.status === 'repaired') {
                await this.startProject(id, project);
            }
        }
        
        this.showSystemStatus();
    }

    async startProject(projectId, project) {
        console.log(`🎯 راه‌اندازی ${project.name}...`);
        
        try {
            process.chdir(project.path);

            let startCommand;
            if (project.type === 'node') {
                startCommand = 'npm start';
            } else if (project.type === 'cpp') {
                startCommand = `./bin/chess_server`;
            } else if (project.type === 'python') {
                startCommand = 'python3 main.py';
            }

            // اجرای پروژه در پس‌زمینه
            const childProcess = spawn(startCommand, [], { 
                stdio: 'inherit',
                detached: true,
                shell: true
            });

            childProcess.unref();
            this.projects[projectId].status = 'active';
            this.projects[projectId].pid = childProcess.pid;
            
            console.log(`   ✅ ${project.name} فعال شد (PID: ${childProcess.pid})`);
            
            process.chdir('..');

        } catch (error) {
            console.log(`   ❌ خطا در راه‌اندازی: ${error.message}`);
        }
    }

    showSystemStatus() {
        console.log('\n📊 وضعیت سیستم Tetrashop:');
        console.log('============================');
        
        for (const [id, project] of Object.entries(this.projects)) {
            const statusIcon = 
                project.status === 'active' ? '🟢' :
                project.status === 'repaired' ? '🟡' :
                project.status === 'error' ? '🔴' : '⚪';
            
            console.log(`${statusIcon} ${project.name}`);
            console.log(`   📍 پورت: ${project.port}`);
            console.log(`   🏷️  اولویت: ${project.priority}`);
            console.log(`   🔧 وضعیت: ${project.status}`);
            console.log(`   🔗 http://localhost:${project.port}`);
            console.log('');
        }
    }

    generateDeploymentReport() {
        const report = {
            timestamp: new Date().toISOString(),
            projects: this.projects,
            summary: {
                total: Object.keys(this.projects).length,
                active: Object.values(this.projects).filter(p => p.status === 'active').length,
                repaired: Object.values(this.projects).filter(p => p.status === 'repaired').length,
                errors: Object.values(this.projects).filter(p => p.status === 'error').length
            }
        };

        fs.writeFileSync('deployment-report.json', JSON.stringify(report, null, 2));
        console.log('📄 گزارش استقرار در deployment-report.json ذخیره شد');
    }
}

// اجرای فوری
const manager = new TetrashopUnifiedManager();

// اگر مستقیماً اجرا شد
if (require.main === module) {
    console.log('🎯 سیستم مدیریت یکپارچه Tetrashop');
    console.log('===================================\n');
    
    manager.emergencyRepairAll().then(() => {
        manager.startAllProjects();
        manager.generateDeploymentReport();
    });
}

module.exports = TetrashopUnifiedManager;
